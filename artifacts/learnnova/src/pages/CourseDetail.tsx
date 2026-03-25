import { useParams, useLocation } from "wouter";
import { useGetCourse, useListConcepts, useEnrollCourse } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Lock, Clock, BookOpen, Network } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function CourseDetail() {
  const params = useParams();
  const courseId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: conceptMap, isLoading: mapLoading } = useListConcepts({ courseId });
  const { mutate: enroll, isPending: isEnrolling } = useEnrollCourse({
    mutation: {
      onSuccess: () => {
        toast({ title: "Successfully enrolled!", type: "success" });
        // The query cache should invalidate ideally, but we'll let wouter re-render or user navigate
      },
      onError: () => {
        toast({ title: "Failed to enroll", type: "error" });
      }
    }
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState("0 0 1000 600");

  if (courseLoading || mapLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!course) return <div>Course not found</div>;

  const conceptEdges = Array.isArray((conceptMap as any)?.edges)
    ? (conceptMap as any).edges
    : [];
  const conceptNodes = Array.isArray((conceptMap as any)?.nodes)
    ? (conceptMap as any).nodes
    : [];
  const courseConcepts = Array.isArray((course as any).concepts)
    ? (course as any).concepts
    : [];

  return (
    <div className="space-y-8">
      <button onClick={() => setLocation('/courses')} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to courses
      </button>

      {/* Course Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12 text-white shadow-xl" style={{ backgroundColor: course.thumbnailColor || 'var(--primary)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-white/20 backdrop-blur-md text-white border-white/30 capitalize">{course.difficulty}</Badge>
            <Badge variant="outline" className="bg-white/20 backdrop-blur-md text-white border-white/30">{course.subject}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4 text-balance drop-shadow-md">{course.title}</h1>
          <p className="text-white/90 text-lg mb-8 leading-relaxed text-balance drop-shadow">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6">
            {!course.isEnrolled ? (
              <Button size="lg" variant="gradient" onClick={() => enroll({ courseId })} isLoading={isEnrolling} className="font-bold px-10 text-lg shadow-2xl">
                Enroll Now
              </Button>
            ) : (
              <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="font-bold flex items-center gap-2"><CheckCircle2 className="text-emerald-400 w-5 h-5"/> Enrolled</div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="min-w-[120px]">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Progress</span><span>{Math.round(course.progress || 0)}%</span>
                  </div>
                  <Progress value={course.progress || 0} indicatorColor="bg-emerald-400" className="h-2 bg-black/20" />
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 drop-shadow-sm"><Clock className="w-5 h-5 opacity-80" /> {course.estimatedHours} Hours</div>
              <div className="flex items-center gap-2 drop-shadow-sm"><BookOpen className="w-5 h-5 opacity-80" /> {course.totalConcepts} Concepts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Concept Map & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-bold flex items-center gap-2">
              <Network className="w-6 h-6 text-primary" /> Concept Map
            </h3>
          </div>
          
          <Card className="overflow-hidden border-border bg-card shadow-inner">
            <div className="relative w-full aspect-[16/10] bg-muted/20">
              {conceptMap && (
                <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full p-4 overflow-visible">
                  {/* Edges */}
                  {conceptEdges.map((edge: any, i: number) => {
                    const source = conceptNodes.find((n: any) => n.id === edge.source);
                    const target = conceptNodes.find((n: any) => n.id === edge.target);
                    if (!source || !target) return null;
                    return (
                      <line 
                        key={i} 
                        x1={`${source.x}%`} y1={`${source.y}%`} 
                        x2={`${target.x}%`} y2={`${target.y}%`} 
                        stroke="currentColor" 
                        strokeWidth="0.4"
                        className="text-border drop-shadow-sm"
                        strokeDasharray={edge.type === 'related' ? "1 1" : "none"}
                      />
                    );
                  })}
                  {/* Nodes */}
                  {conceptNodes.map((node: any) => {
                    let color = "text-muted-foreground bg-muted";
                    let fill = "currentColor";
                    if (node.masteryLevel >= 80) fill = "hsl(var(--emerald-500, 150 84% 40%))";
                    else if (node.masteryLevel > 0) fill = "hsl(var(--amber-500, 38 92% 50%))";
                    else fill = "hsl(var(--muted-foreground))";

                    return (
                      <g key={node.id} className="cursor-pointer group transition-transform hover:scale-110 origin-center" style={{ transformOrigin: `${node.x}% ${node.y}%`}}>
                        <circle cx={`${node.x}%`} cy={`${node.y}%`} r="3" fill="var(--color-card)" stroke={fill} strokeWidth="1" className="drop-shadow-md" />
                        <circle cx={`${node.x}%`} cy={`${node.y}%`} r="2" fill={fill} className="opacity-80" />
                        <text 
                          x={`${node.x}%`} y={`${node.y + 5}%`} 
                          textAnchor="middle" 
                          className="text-[3px] font-bold fill-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
            <div className="bg-muted/30 p-4 border-t border-border flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div> Mastered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div> In Progress</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted-foreground shadow-sm"></div> Not Started</div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold">Curriculum</h3>
          <div className="space-y-3">
            {courseConcepts.map((concept: any) => (
              <Card key={concept.id} className={cn("transition-all duration-200", !concept.isUnlocked && "opacity-60 bg-muted/50")}>
                <CardContent className="p-4 flex gap-4">
                  <div className="shrink-0 pt-1">
                    {!concept.isUnlocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : concept.masteryLevel >= 80 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-sm">{concept.name}</h4>
                    {concept.isUnlocked && (
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={concept.masteryLevel} className="flex-1 h-1.5" />
                        <span className="text-xs font-bold text-muted-foreground min-w-[3ch]">{Math.round(concept.masteryLevel)}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

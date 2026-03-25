import { useState } from "react";
import { useListCourses } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Filter, Clock, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

export default function Courses() {
  const { data: courses, isLoading } = useListCourses();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCourses = courses?.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "enrolled" ? c.isEnrolled : c.difficulty === filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Explore Courses</h1>
          <p className="text-muted-foreground mt-2">Discover new topics and expand your knowledge map.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 pl-4 pr-10 rounded-xl bg-card border border-border text-sm outline-none appearance-none focus:border-primary cursor-pointer shadow-sm"
            >
              <option value="all">All Levels</option>
              <option value="enrolled">My Courses</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-muted/50 animate-pulse rounded-2xl border border-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/courses/${course.id}`} className="block h-full group">
                <Card className="h-full flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 border-border/60 hover:border-primary/30">
                  <div 
                    className="h-32 p-6 flex flex-col justify-between relative overflow-hidden"
                    style={{ backgroundColor: course.thumbnailColor || 'var(--primary)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <Badge variant="outline" className="bg-white/20 backdrop-blur-md text-white border-white/30 capitalize">
                        {course.difficulty}
                      </Badge>
                      {course.isEnrolled && (
                        <Badge variant="success" className="bg-emerald-500/20 backdrop-blur-md text-white border-emerald-400/30">
                          Enrolled
                        </Badge>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{course.title}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {course.description}
                    </p>
                    
                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {course.totalConcepts} concepts</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.estimatedHours}h</div>
                        <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.enrolledCount}</div>
                      </div>
                      
                      {course.isEnrolled && course.progress !== undefined ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span>Progress</span>
                            <span>{Math.round(course.progress || 0)}%</span>
                          </div>
                          <Progress value={course.progress || 0} />
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
          {filteredCourses?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No courses found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useGetProgress, useGetMemoryGraph, useGetKnowledgeGaps, useGetForgettingCurve, useGetLearningPath } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { BrainCircuit, Target, AlertTriangle, TrendingDown } from "lucide-react";
import { Link } from "wouter";

export default function ProgressTracker() {
  const { data: progress } = useGetProgress();
  const { data: memoryGraph } = useGetMemoryGraph();
  const { data: gaps } = useGetKnowledgeGaps();
  const { data: forgettingCurve } = useGetForgettingCurve();
  const { data: learningPath } = useGetLearningPath();
  const gapList = Array.isArray(gaps) ? gaps : [];
  const memoryData = Array.isArray(memoryGraph) ? memoryGraph : [];
  const forgettingData = Array.isArray(forgettingCurve) ? forgettingCurve : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground mt-2">AI-driven insights into your memory retention and learning efficiency.</p>
      </div>

      {/* Overview Stats */}
      {progress && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-primary">{progress.masteredConcepts}</span>
              <span className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Mastered Concepts</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-emerald-500">{Math.round(progress.averageRetention)}%</span>
              <span className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Avg Retention</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-amber-500">{progress.assessmentsPassed}</span>
              <span className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Assessments Passed</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-blue-500">{Math.round(progress.weeklyGoalProgress)}%</span>
              <span className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Weekly Goal</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Memory Graph */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" /> Memory Retention Graph
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {memoryData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, {month:'short', day:'numeric'})} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="retention" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Forgetting Curve Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-secondary" /> Forgetting Curve Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {forgettingData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forgettingData.slice(0, 5)} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="conceptName" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="retentionAtStudy" name="Original Retention" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.3} />
                    <Bar dataKey="retentionNow" name="Current Retention" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Knowledge Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gapList.map((gap) => (
              <div key={gap.id} className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm">{gap.conceptName}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{gap.recommendedAction}</p>
                  </div>
                  <Badge variant={gap.priority === 'high' ? 'danger' : gap.priority === 'medium' ? 'warning' : 'default'} className="uppercase px-2 text-[10px]">
                    {gap.priority} Priority
                  </Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs flex-1">Review Material</Button>
                  <Button size="sm" variant="primary" className="h-8 text-xs flex-1">Take Quiz</Button>
                </div>
              </div>
            ))}
            {gapList.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No major knowledge gaps detected. Keep going!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

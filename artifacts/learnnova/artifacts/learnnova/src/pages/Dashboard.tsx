import { useGetDashboardStats, useGetStudent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Flame, Star, Brain, BookOpen, Clock, Activity, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: student } = useGetStudent();

  if (statsLoading || !stats || !student) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Enrolled Courses", value: stats.enrolledCourses, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Mastered Concepts", value: stats.masteredConcepts, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Avg. Retention", value: `${Math.round(stats.averageRetention)}%`, icon: Brain, color: "text-primary", bg: "bg-primary/10" },
    { label: "Study Time", value: `${Math.round(stats.weeklyStudyMinutes / 60)}h ${stats.weeklyStudyMinutes % 60}m`, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      {/* Greeting Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">Welcome back, {student.name.split(' ')[0]}! 👋</h1>
            <p className="mt-2 text-primary-foreground/80 max-w-xl text-lg">
              You're doing great! Keep up the momentum to master your current courses.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-xl text-orange-300">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{stats.streakDays}</div>
                <div className="text-xs font-medium text-white/70 uppercase tracking-wider mt-1">Day Streak</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3">
              <div className="p-2 bg-yellow-400/20 rounded-xl text-yellow-300">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{stats.totalXp}</div>
                <div className="text-xs font-medium text-white/70 uppercase tracking-wider mt-1">Total XP</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="hover:shadow-md transition-shadow hover:border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Recommendation */}
          <Card className="border-primary/20 bg-primary/5 shadow-inner">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="shrink-0 p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/30 h-fit">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">AI Learning Path</h3>
                  <p className="text-muted-foreground mt-1 mb-4">Based on your forgetting curve, here's what you should focus on today to maximize retention.</p>
                  
                  {stats.upcomingReviews.length > 0 && (
                    <div className="bg-background rounded-xl p-4 border border-border flex items-center justify-between shadow-sm">
                      <div>
                        <div className="font-bold">{stats.upcomingReviews[0].conceptName}</div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                          Retention dropped to {Math.round(stats.upcomingReviews[0].retentionLevel)}%
                        </div>
                      </div>
                      <Link href="/progress" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                        Review Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold">Recent Activity</h3>
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <Card>
              <div className="divide-y divide-border/50">
                {stats.recentActivity.map((activity, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="p-2 rounded-full bg-muted text-muted-foreground">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.timeAgo}</p>
                    </div>
                    {activity.xpGained && (
                      <div className="text-sm font-bold text-amber-500">
                        +{activity.xpGained} XP
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Upcoming Reviews</h3>
            <Card>
              <div className="p-2 space-y-2">
                {stats.upcomingReviews.map((review, i) => (
                  <div key={i} className="p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{review.conceptName}</div>
                      <div className="text-xs text-muted-foreground mt-1">Due {review.dueIn}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold mb-1">{Math.round(review.retentionLevel)}% Retention</div>
                      <Progress value={review.retentionLevel} className="w-16 h-1.5" 
                        indicatorColor={review.retentionLevel < 50 ? "bg-destructive" : review.retentionLevel < 80 ? "bg-amber-500" : "bg-emerald-500"} 
                      />
                    </div>
                  </div>
                ))}
                {stats.upcomingReviews.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    All caught up! 🎉
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

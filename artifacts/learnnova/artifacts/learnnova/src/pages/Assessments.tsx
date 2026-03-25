import { useState } from "react";
import { useListAssessments, useSubmitAssessment } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Brain, Clock, ChevronRight, Trophy, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Assessments() {
  const { data: assessments, isLoading, refetch } = useListAssessments();
  const { toast } = useToast();
  
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [resultId, setResultId] = useState<number | null>(null);

  const { mutate: submit, isPending: isSubmitting, data: result } = useSubmitAssessment({
    mutation: {
      onSuccess: (data) => {
        setResultId(data.assessmentId);
        setActiveQuizId(null);
        toast({ title: "Assessment completed!", type: "success" });
        refetch();
      }
    }
  });

  const handleStart = (id: number) => {
    setActiveQuizId(id);
    setResultId(null);
  };

  const handleComplete = (id: number) => {
    // Mock submission payload
    submit({ 
      assessmentId: id, 
      data: {
        timeTaken: 120,
        answers: [{ questionId: 1, answer: "Mock Answer" }]
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center"><div className="animate-spin inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Assessments</h1>
        <p className="text-muted-foreground mt-2">Test your knowledge. Questions adapt dynamically to your skill level.</p>
      </div>

      <AnimatePresence mode="wait">
        {activeQuizId ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Question 1 of 5</Badge>
                  <div className="flex items-center gap-2 text-muted-foreground font-mono font-medium">
                    <Clock className="w-4 h-4" /> 14:59
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-8 leading-relaxed">
                  Based on the forgetting curve, when is the optimal time to review a newly learned concept to maximize long-term retention?
                </h2>
                
                <div className="space-y-3 mb-10">
                  {["Immediately after learning", "Just before you are about to forget it", "One month later", "Never, if learned properly"].map((opt, i) => (
                    <button key={i} className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary focus:border-primary focus:bg-primary/5 transition-all outline-none font-medium">
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <Button variant="ghost" onClick={() => setActiveQuizId(null)}>Cancel</Button>
                  <Button onClick={() => handleComplete(activeQuizId)} isLoading={isSubmitting} size="lg" className="px-8">
                    Submit Answer <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : result && resultId ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
          >
            <Card className="border-emerald-500/20 shadow-lg shadow-emerald-500/5 text-center overflow-hidden">
              <div className="bg-gradient-to-b from-emerald-500/10 to-transparent p-10 pb-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/30 mb-6">
                  <Trophy className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-bold">Quiz Complete!</h2>
                <p className="text-muted-foreground mt-2">You earned <span className="font-bold text-amber-500">{result.xpEarned} XP</span></p>
              </div>
              
              <CardContent className="p-8 pt-0">
                <div className="flex justify-center gap-8 mb-8 pb-8 border-b border-border">
                  <div>
                    <div className="text-4xl font-bold text-foreground">{Math.round(result.score)}%</div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mt-1">Score</div>
                  </div>
                  <div className="w-px bg-border"></div>
                  <div>
                    <div className="text-4xl font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mt-1">Correct</div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-2xl p-6 text-left border border-primary/10">
                  <h4 className="font-bold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5 text-primary" /> AI Feedback</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">{result.feedback}</p>
                  <p className="text-sm font-semibold text-primary">Next Step: {result.nextRecommendation}</p>
                </div>
                
                <Button className="w-full mt-6" size="lg" onClick={() => setResultId(null)}>Continue Learning</Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments?.map((assessment) => (
              <Card key={assessment.id} className="flex flex-col hover:shadow-md transition-shadow hover:border-primary/30">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={assessment.adaptiveLevel === 'hard' ? 'danger' : assessment.adaptiveLevel === 'medium' ? 'warning' : 'success'} className="uppercase text-[10px] tracking-wide">
                      {assessment.adaptiveLevel}
                    </Badge>
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {assessment.timeLimit}m
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg leading-tight mb-2">{assessment.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-6">
                    <Brain className="w-4 h-4 opacity-70" /> {assessment.courseName}
                  </p>
                  
                  <div className="mt-auto">
                    {assessment.status === 'completed' ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Score</span>
                        <span className="font-bold text-emerald-500 text-lg">{assessment.score}%</span>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full font-bold group" onClick={() => handleStart(assessment.id)}>
                        Start Quiz <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

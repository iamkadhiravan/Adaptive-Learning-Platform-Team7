import { useEffect } from "react";
import { useGetStudent, useUpdateStudent } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Settings, Save, Shield } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  learningStyle: z.enum(["visual", "auditory", "reading", "kinesthetic"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Account() {
  const { data: student, isLoading } = useGetStudent();
  const { toast } = useToast();
  
  const { mutate: updateProfile, isPending } = useUpdateStudent({
    mutation: {
      onSuccess: () => {
        toast({ title: "Profile updated successfully!", type: "success" });
      },
      onError: () => {
        toast({ title: "Failed to update profile", type: "error" });
      }
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        email: student.email,
        learningStyle: student.learningStyle,
      });
    }
  }, [student, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({ data });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and learning preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-b from-primary/10 to-transparent p-6 text-center border-b border-border/50">
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student?.name || 'alex'}&backgroundColor=e2e8f0`} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto mb-4 bg-muted"
              />
              <h3 className="font-bold text-lg">{student?.name}</h3>
              <p className="text-sm text-muted-foreground">Level {student?.level} Scholar</p>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                <button className="w-full flex items-center gap-3 p-4 text-sm font-medium hover:bg-muted/50 transition-colors text-primary bg-primary/5">
                  <User className="w-4 h-4" /> Personal Info
                </button>
                <button className="w-full flex items-center gap-3 p-4 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                  <Shield className="w-4 h-4" /> Security & Privacy
                </button>
                <button className="w-full flex items-center gap-3 p-4 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                  <Settings className="w-4 h-4" /> Preferences
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6 md:p-8">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                Personal Information
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" /> Full Name
                    </label>
                    <input 
                      {...register("name")}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Alex Chen"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                    </label>
                    <input 
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="alex@example.com"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Preferred Learning Style</label>
                  <p className="text-xs text-muted-foreground mb-3">AI will adapt content format based on your selection.</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "visual", label: "Visual (Images & Graphs)" },
                      { id: "auditory", label: "Auditory (Audio & Speech)" },
                      { id: "reading", label: "Reading/Writing (Text)" },
                      { id: "kinesthetic", label: "Kinesthetic (Interactive)" }
                    ].map((style) => (
                      <label key={style.id} className="relative flex cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary">
                        <input type="radio" value={style.id} {...register("learningStyle")} className="sr-only" />
                        <span className="font-medium text-sm">{style.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.learningStyle && <p className="text-xs text-destructive">{errors.learningStyle.message}</p>}
                </div>

                <div className="pt-6 flex justify-end">
                  <Button type="submit" isLoading={isPending} className="px-8 font-bold">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

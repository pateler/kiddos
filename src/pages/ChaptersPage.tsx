
import React from "react";
import { AppLayout } from "@/components/AppLayout";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ChaptersPage = () => {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const classNum = parseInt(classId || "1");
  
  // Get subject info based on subjectId
  const subject = getSubjectInfo(subjectId || "");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  };

  // Mocked chapter data
  const chapters = Array.from({ length: subject.chapters }, (_, i) => ({
    id: i + 1,
    title: `Chapter ${i + 1}: ${getChapterTitle(subject.id, i + 1)}`,
    completed: i < 2, // First two chapters are completed
    locked: i > 3, // Chapters after the 4th are locked
    progress: i < 2 ? 100 : i === 2 ? 60 : i === 3 ? 20 : 0
  }));

  return (
    <AppLayout>
      <div className="kiddo-container py-8">
        <Link to={`/classes/${classId}/subjects`}>
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to Subjects</span>
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className={`inline-block rounded-full mb-4 p-4 bg-kiddo-${subject.color}`}>
            {getSubjectIcon(subject.icon)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {subject.name}
          </h1>
          <p className="text-gray-600">
            Class {classNum} • {subject.chapters} Chapters
          </p>
          
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Your Progress</span>
              <span className="font-semibold">25%</span>
            </div>
            <Progress value={25} className="h-3" />
          </div>
        </div>

        <motion.div 
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {chapters.map((chapter) => (
            <motion.div 
              key={chapter.id} 
              variants={itemVariants}
              className="mb-4"
            >
              <Link to={chapter.locked ? "#" : `/classes/${classId}/subjects/${subjectId}/chapters/${chapter.id}`}>
                <div className={`bg-white rounded-2xl border-2 ${chapter.locked ? 'border-gray-200' : `border-kiddo-${subject.color}`} p-4 flex items-center justify-between hover:shadow-md transition-shadow ${chapter.locked ? 'opacity-70' : ''}`}>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${chapter.locked ? 'bg-gray-200' : chapter.completed ? `bg-kiddo-${subject.color}` : 'bg-gray-100'} flex items-center justify-center mr-4`}>
                      {chapter.locked ? (
                        <Lock size={20} className="text-gray-500" />
                      ) : chapter.completed ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <span className="text-lg font-bold text-gray-500">{chapter.id}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{chapter.title}</h3>
                      <div className="mt-1">
                        {chapter.locked ? (
                          <span className="text-sm text-gray-500">Complete previous chapters to unlock</span>
                        ) : (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{chapter.completed ? 'Completed' : 'In Progress'}</span>
                              <span className="font-semibold">{chapter.progress}%</span>
                            </div>
                            <Progress value={chapter.progress} className="h-2 w-48" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!chapter.locked && (
                    <Button className={`bg-kiddo-${subject.color} hover:bg-opacity-90`}>
                      {chapter.completed ? 'Review' : 'Continue'}
                    </Button>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
};

// Helper function to get subject information
function getSubjectInfo(subjectId: string) {
  const subjects = {
    "math": {
      id: "math",
      name: "Mathematics",
      icon: "calculator",
      color: "blue",
      chapters: 8
    },
    "english": {
      id: "english",
      name: "English",
      icon: "book",
      color: "yellow",
      chapters: 10
    },
    "science": {
      id: "science",
      name: "Science",
      icon: "flask",
      color: "green",
      chapters: 6
    },
    "social": {
      id: "social",
      name: "Social Studies",
      icon: "globe",
      color: "purple",
      chapters: 5
    },
    "arts": {
      id: "arts",
      name: "Arts & Crafts",
      icon: "palette",
      color: "pink",
      chapters: 4
    },
    "computer": {
      id: "computer",
      name: "Computer",
      icon: "monitor",
      color: "teal",
      chapters: 5
    }
  };
  
  return subjects[subjectId as keyof typeof subjects] || subjects.math;
}

// Helper function to get chapter titles based on subject
function getChapterTitle(subjectId: string, chapterNum: number): string {
  const titles: Record<string, string[]> = {
    "math": [
      "Numbers and Counting",
      "Addition and Subtraction",
      "Shapes and Patterns",
      "Measurement",
      "Time and Money",
      "Multiplication Basics",
      "Division Basics",
      "Fractions Introduction"
    ],
    "english": [
      "Alphabet and Phonics",
      "Word Recognition",
      "Simple Sentences",
      "Reading Comprehension",
      "Storytelling",
      "Grammar Basics",
      "Writing Skills",
      "Poetry and Rhymes",
      "Speaking Skills",
      "Listening Skills"
    ],
    "science": [
      "Living Things",
      "Plants and Animals",
      "Human Body",
      "Materials and Matter",
      "Earth and Space",
      "Forces and Energy"
    ],
    "social": [
      "My Family",
      "Our Community",
      "Our Country",
      "World Around Us",
      "History and Culture"
    ],
    "arts": [
      "Colors and Painting",
      "Drawing and Sketching",
      "Crafts and Creations",
      "Music and Rhythm"
    ],
    "computer": [
      "Introduction to Computers",
      "Keyboard and Mouse",
      "Basic Software",
      "Internet Safety",
      "Digital Art"
    ]
  };
  
  const subjectTitles = titles[subjectId] || titles.math;
  return subjectTitles[chapterNum - 1] || `Learning Module ${chapterNum}`;
}

// Helper function to render subject icons
function getSubjectIcon(iconName: string): JSX.Element {
  const iconStyle = "w-10 h-10 text-white";
  
  switch (iconName) {
    case "calculator":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /><path d="M8 16h.01" /><path d="M12 16h.01" /><path d="M12 20h.01" /><path d="M8 20h.01" /></svg>
      );
    case "book":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
      );
    case "flask":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v2H9zM8 3h8l-1 6.5.5.5-5 8v.5h-.5l-.5-.5-1-1 5-8 .5-.5L8 3z" /><path d="M6.5 20A3.5 3.5 0 0 1 3 16.5v-.74A5 5 0 0 1 4.5 11l.5-2 5 8H8.5L7 14l3 4H6.5zM17.5 20a3.5 3.5 0 0 0 3.5-3.5v-.74A5 5 0 0 0 19.5 11l-.5-2-5 8h1.5l1.5-3-3 4h3.5z" /></svg>
      );
    case "globe":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
      );
    case "palette":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
      );
    case "monitor":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      );
  }
}

export default ChaptersPage;

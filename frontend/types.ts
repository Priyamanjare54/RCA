
export enum StudentCategory {
  BATSMAN = 'Batsman',
  BOWLER = 'Bowler',
  ALL_ROUNDER = 'All-Rounder',
  WICKET_KEEPER = 'Wicket Keeper'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'Coach' | 'Admin';
}

export interface Student {
  id: string;
  name: string;
  age: number;
  category: StudentCategory;
  joinDate: string;
  batchId?: string;
}

export interface Batch {
  id: string;
  name: string;
  coachId: string;
  coachName?: string;
  schedule: string;
  level: 'Beginner' | 'Intermediate' | 'Elite';
}

export interface DashboardStats {
  studentCount: number;
  matchCount: number;
  batchCount: number;
  attendanceRate: string;
}

export interface AttendanceRecord {
  date: string;
  presentIds: string[];
}

// Interface for fitness test data used in tracking athlete performance
export interface FitnessTest {
  pushups: string;
  squats: string;
  burpees: string;
  plankHold: string;
  chairHold: string;
  sprint20m: string;
  sprint40m: string;
  sprint60m: string;
  yoyoTest: string;
  notes: string;
}

export interface PerformanceMetric {
  id: string;
  studentId: string;
  date: string;
  runs?: string;
  wickets?: string;
  notes: string;
  metrics?: any;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  format: 'T20' | 'ODI' | 'Test' | 'Friendly';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

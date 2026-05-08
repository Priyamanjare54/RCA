
import React from 'react';
import { Student, StudentCategory, Match } from './types';

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Virat Sharma', age: 14, category: StudentCategory.BATSMAN, joinDate: '2023-05-12' },
  { id: '2', name: 'Jasprit Khan', age: 16, category: StudentCategory.BOWLER, joinDate: '2023-01-20' },
  { id: '3', name: 'Ravindra Singh', age: 15, category: StudentCategory.ALL_ROUNDER, joinDate: '2023-03-15' },
  { id: '4', name: 'KL Rahul', age: 17, category: StudentCategory.WICKET_KEEPER, joinDate: '2022-11-10' },
  { id: '5', name: 'Rohit Gill', age: 13, category: StudentCategory.BATSMAN, joinDate: '2024-02-01' },
];

export const MOCK_MATCHES: Match[] = [
  { id: 'm1', opponent: 'Rising Stars Academy', date: '2024-06-15', time: '09:00 AM', venue: 'Main Ground', format: 'T20', status: 'Scheduled' },
  { id: 'm2', opponent: 'Victory XI', date: '2024-06-20', time: '10:00 AM', venue: 'Practice Oval', format: 'ODI', status: 'Scheduled' },
];

export const MOTIVATIONAL_QUOTES = [
  "Hard work beats talent when talent doesn't work hard.",
  "You don't play for revenge. You play for honor and pride.",
  "Every ball is a new opportunity to change the game.",
  "The more I practice, the luckier I get.",
  "Cricket is not just a game, it's a way of life.",
  "A true athlete doesn't give up when things get tough, they get tougher."
];

export const ICONS = {
  Dashboard: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Attendance: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  Performance: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Schedule: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  VideoAI: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Chat: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
};


import React from "react";
import { Layout } from "@/components/layout/Layout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { Award, Gift, Trash, Search, Filter, Plus, Tag, ArrowUp, ArrowDown, Check, Clock, ShoppingCart } from "lucide-react";

const rewardData = [
  { name: "Week 1", points: 2400 },
  { name: "Week 2", points: 1398 },
  { name: "Week 3", points: 3800 },
  { name: "Week 4", points: 3908 },
];

const wasteTypeData = [
  { name: "Plastic", value: 35 },
  { name: "Paper", value: 25 },
  { name: "Organic", value: 30 },
  { name: "Metal", value: 10 },
];

const topPerformers = [
  { id: 1, house: "Ngugi Family", points: 520, lastActivity: "2 days ago", trend: "up" },
  { id: 2, house: "Chen Residence", points: 480, lastActivity: "1 day ago", trend: "up" },
  { id: 3, house: "Johnson Home", points: 455, lastActivity: "3 days ago", trend: "up" },
  { id: 4, house: "Akbar Compound", points: 430, lastActivity: "1 week ago", trend: "down" },
  { id: 5, house: "Martinez Family", points: 405, lastActivity: "5 days ago", trend: "up" },
  { id: 6, house: "Wong Apartment", points: 380, lastActivity: "2 days ago", trend: "up" },
  { id: 7, house: "Singh Residence", points: 365, lastActivity: "1 day ago", trend: "down" },
  { id: 8, house: "Kimani Household", points: 350, lastActivity: "4 days ago", trend: "up" },
  { id: 9, house: "Omondi Family", points: 340, lastActivity: "6 days ago", trend: "down" },
  { id: 10, house: "Garcia Residence", points: 325, lastActivity: "1 week ago", trend: "up" },
];

const rewardItems = [
  {
    id: 1,
    name: "Eco-Friendly Water Bottle",
    points: 100,
    available: true,
    claimed: 24,
    image: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?auto=format&fit=crop&q=80&w=1500&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    name: "Reusable Shopping Bag",
    points: 50,
    available: true,
    claimed: 38,
    image: "https://images.unsplash.com/photo-1591195853866-70b4489a88f8?auto=format&fit=crop&q=80&w=1500&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    name: "Compost Bin",
    points: 300,
    available: true,
    claimed: 12,
    image: "https://images.unsplash.com/photo-1588964999066-a261936ab233?auto=format&fit=crop&q=80&w=1500&ixlib=rb-4.0.3",
  },
  {
    id: 4,
    name: "Discount on Collection Fee",
    points: 200,
    available: true,
    claimed: 45,
    image: "https://images.unsplash.com/photo-1586034679970-cb7b5fc4928a?auto=format&fit=crop&q=80&w=1500&ixlib=rb-4.0.3",
  },
];

const Rewards = () => {
  return (

      <></>

  );
};

export default Rewards;

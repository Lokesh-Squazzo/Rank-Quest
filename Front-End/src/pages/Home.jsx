import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Assuming you have a Button component

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to RankQuest
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Your journey to becoming a coding champion starts here.
      </p>
      <div className="flex space-x-4">
        <Link to="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link to="/register">
          <Button size="lg" variant="outline">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
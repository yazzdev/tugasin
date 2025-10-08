import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/ui/Button';
import { ArrowRight, Kanban, Users, Clock } from 'lucide-react';

const LandingPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = async () => {
    setIsCreating(true);
    const boardId = uuidv4();
    window.location.href = `/board/${boardId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skylight-secondary to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-skylight-primary p-3 rounded-xl mr-3">
              <Kanban className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">Tugasin</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The instant Kanban board for teams. No login required, no setup needed.
          </p>
        </motion.header>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Collaborate in Real-Time
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Create boards instantly. Share links with your team. Start collaborating immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCreateBoard}
                loading={isCreating}
                className="px-8 py-4 text-lg"
              >
                {isCreating ? 'Creating...' : 'Create New Board'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Link to="/board/demo">
                <Button variant="outline" className="px-8 py-4 text-lg">
                  Try Demo Board
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-skylight-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-skylight-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Login Required</h3>
            <p className="text-slate-600">Instant access - start using immediately without any account setup.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-skylight-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-skylight-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Auto Cleanup</h3>
            <p className="text-slate-600">Boards automatically expire after 7 days of inactivity to keep things clean.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-skylight-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Kanban className="w-8 h-8 text-skylight-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Real Collaboration</h3>
            <p className="text-slate-600">Share links and collaborate with your team in real-time.</p>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Modern Kanban Experience
          </h3>
          <div className="bg-skylight-card rounded-lg p-6 min-h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-96 h-48 mb-4 mx-auto" />
              <p className="text-slate-600">Beautiful, responsive Kanban board interface</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
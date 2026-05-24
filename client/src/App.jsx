


import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import WriteArticle from './pages/WriteArticle';
import BlogTitles from './pages/BlogTitles';
import GenerateImages from './pages/GenerateImages';
import RemoveBackground from './pages/RemoveBackground';
import DescribeProblem from './pages/DescribeProblem'
import Flowchart from './pages/Flowchart'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import About from './pages/About'
import CodeFlow from './pages/CodeFlow';
import Blogs from './pages/Blogs';
import BlogDetailsPage from './pages/BlogDetailsPage';
import BlogEditor from './pages/BlogEditor';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from '@clerk/clerk-react';

const App = () => {
  const {getToken}=useAuth()
  useEffect(()=>{
    getToken().then((token)=>console.log(token));
  },[])

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Home />} />
        
        {/* Layout routes wrapper */}
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} /> 
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='blogs' element={<Blogs />} />
          <Route path='blog/:id' element={<BlogDetailsPage />} />
          <Route path='create-blog/editor' element={<BlogEditor />} />
          <Route path='admin-dashboard' element={<AdminDashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GenerateImages/>} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='describe-problem' element={<DescribeProblem />} />
          <Route path='flowchart' element={<Flowchart />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
          <Route path='about' element={<About />} />
          <Route path='codeflow' element={<CodeFlow />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

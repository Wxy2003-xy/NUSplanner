import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './community.css';
import logoImage from '../../images/nusplannerLogo.png';
import pencilIcon from '../../images/pencilicon.jpeg';

interface Post {
  title: string;
  content: string;
}

const Community = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
    loadPosts();
  }, []);

  const loadPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(storedPosts);
  };

  const savePost = (post: Post) => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    storedPosts.push(post);
    localStorage.setItem('posts', JSON.stringify(storedPosts));
    setPosts(storedPosts);
  };

  const handleSearch = () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const filteredPosts = storedPosts.filter((post: Post) => 
      post.title.toLowerCase().includes(searchInput.toLowerCase()) || 
      post.content.toLowerCase().includes(searchInput.toLowerCase())
    );
    setPosts(filteredPosts);
  };

  const handleSubmitPost = (title: string, content: string) => {
    const newPost = { title, content };
    savePost(newPost);
    loadPosts();
    closeModal();
  };

  const openModal = () => {
    const modal = document.getElementById('postModal');
    if (modal) modal.style.display = 'block';
  };

  const closeModal = () => {
    const modal = document.getElementById('postModal');
    if (modal) modal.style.display = 'none';
  };

  return (
    <div>
      <header>
        <div className="header-left">
          <NavLink to="/" className="logo-link">
            <div className="logo-container">
              <img src={logoImage} alt="Logo" />
              <span>NUSPlanner</span>
            </div>
          </NavLink>
          <div className="title-container">
            <p></p>
          </div>
        </div>
        <div className="date-container">
          <span>{currentDate}</span>
        </div>
      </header>
      <div className="content">
        <nav>
          <div className="nav-left" style={{ height: "100vh" }}>
            <ul>
              <li className="home">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>🏠<span>Home</span></NavLink>
              </li>
              <li>
                <NavLink to="/studyplan" className={({ isActive }) => isActive ? "active" : ""}>📘<span>Study Plan</span></NavLink>
              </li>
              <li className="timetable">
                <NavLink to="/timetable" className={({ isActive }) => isActive ? "active" : ""}>📋<span>Timetable</span></NavLink>
              </li>
              <li className="community">
                <NavLink to="/community" className={({ isActive }) => isActive ? "active" : ""}>👥️<span>Community</span></NavLink>
              </li>
              <li className="feedback">
                <NavLink to="/feedback" className={({ isActive }) => isActive ? "active" : ""}>✏️<span>Feedback</span></NavLink>
              </li>
              <li className="about">
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>About us</span></NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-right">
            <div className="search-box">
              <img src={logoImage} alt="Logo" />
              <input 
                type="text" 
                id="search-input" 
                placeholder="Search..." 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }} 
              />
              <img src={pencilIcon} alt="Create Post" className="pencil-icon" onClick={openModal} />
            </div>
            <div id="posts-container">
              {posts.map((post, index) => (
                <div key={index} className="post">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div id="postModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2>Create a Post</h2>
          <input type="text" id="postTitle" placeholder="Title" />
          <textarea id="postContent" placeholder="Content" rows={5}></textarea>
          <button onClick={() => {
            const title = (document.getElementById('postTitle') as HTMLInputElement).value;
            const content = (document.getElementById('postContent') as HTMLTextAreaElement).value;
            if (title && content) {
              handleSubmitPost(title, content);
            } else {
              alert('Please enter both a title and content.');
            }
          }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Community;



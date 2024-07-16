import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './community.css';
import logoImage from '../../images/nusplannerLogo.png';
import pencilIcon from '../../images/pencilicon.jpeg';
import Layout from '../../components/Layout';
import reloadIcon from '../../images/reloadIcon.png';

axios.defaults.baseURL = 'http://47.116.173.60:8080';

interface Post {
  title: string;
  content: string;
}

const Community = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await axios.get('/v1/article/select');
      if (response.data && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        setFilteredPosts(response.data.data);
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const savePost = async (post: Post) => {
    try {
      await axios.post('/v1/article/save', post);
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  }; 

  const handleSearch = () => {
    if (searchInput) {
      const filtered = posts.filter(
        post => post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                post.content.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  const handleSubmitPost = async (title: string, content: string) => {
    const newPost = { title, content };
    await savePost(newPost);
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

  const handleRefresh = () => {
    loadPosts();
    setSearchInput('');
  };

  return (
    <Layout>
      <div>
        <div className="community-nav-right">
          <div className="search-box">
            <img src={logoImage} className="logoImage" alt="Logo" />
            <input 
              type="text" 
              id="search-input" 
              placeholder="Search..." 
              value={searchInput} 
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch();
              }} 
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }} 
            />
            <img src={reloadIcon} alt="Refresh" className="reload-icon" onClick={handleRefresh} />
            <img src={pencilIcon} alt="Create Post" className="pencil-icon" onClick={openModal} />
          </div>
          <div id="posts-container">
            {filteredPosts.map((post, index) => (
              <div key={index} className="post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
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
    </Layout>
  );
};

export default Community;



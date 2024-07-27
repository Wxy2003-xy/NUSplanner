import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './community.css';
import logoImage from '../../images/nusplannerLogo.png';
import pencilIcon from '../../images/pencilicon.jpeg';
import Layout from '../../components/Layout';
import reloadIcon from '../../images/reloadIcon.png';

axios.defaults.baseURL = 'http://47.116.173.60:8080';

interface Post {
  id: number;
  title: string;
  content: string;
  thumbsup: number;
  dislike: number;
}

const Community = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
    loadPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
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

  const handleSubmitPost = async (id: number, title: string, content: string, thumbsup: number, dislike: number ) => {
    const newPost = { id, title, content, thumbsup, dislike};
    await savePost(newPost);
    closeModal();
    // Clear the input fields
    (document.getElementById('postTitle') as HTMLInputElement).value = '';
    (document.getElementById('postContent') as HTMLTextAreaElement).value = '';
  };

  const handleLikePost = async (postId: number) => {
    try {
      const response = await axios.post(`/v1/article/updateLike/${postId}`);
      if (response.data) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislikePost = async (postId: number) => {
    try {
      const response = await axios.post(`/v1/article/updateDislike/${postId}`);
      if (response.data) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleReportPost = (post: Post) => {
    const serviceID = 'service_j372can';
    const templateID = 'template_bi1g9kb';
    const userID = 'PtThpNOKmxSv-C1nB';
    const templateParams = {
      message: 'Reported Post: Title {' + post.title + '}' + ', Content {' + post.content + '}',
      to_email: 'nusplanner2024@gmail.com',
    };
    emailjs.send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log('Report sent successfully!', response.status, response.text);
        setModalText('Thank you for your report. Your report will be reviewed shortly.');
        setIsModalOpen(true);
      }, (error) => {
        console.error('Failed to send report.', error);
      });
  };

  const openModal = () => {
    // Clear the input fields before opening the modal
    (document.getElementById('postTitle') as HTMLInputElement).value = '';
    (document.getElementById('postContent') as HTMLTextAreaElement).value = '';
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
            {filteredPosts.map((post) => (
              <div key={post.id} className="post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                
                <div className="post-actions">
                  <button onClick={() => handleLikePost(post.id)}> 👍 {post.thumbsup}</button>
                  <button onClick={() => handleDislikePost(post.id)}>👎 {post.dislike}</button>
                  <button onClick={() => handleReportPost(post)}>Report</button>                   
                </div>
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
                handleSubmitPost(0, title, content, 0, 0);
              } else {
                alert('Please enter both a title and content.');
              }
            }}>Submit</button>
          </div>
        </div>

        {isModalOpen && (
          <div id="myModal" className="modal show" ref={modalRef}>
            <div className="modal-content">
              <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
              <p id="modal-text">{modalText}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;



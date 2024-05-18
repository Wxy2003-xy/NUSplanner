import './Footer.css'; 
function Footer() {

    return (
        <footer>
            <p>
                &copy; 
                {new Date().getFullYear()}
                NUSplanner
            </p>
        </footer>
    );
}

export default Footer
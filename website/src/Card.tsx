import profilePic from './assets/400.svg'
function Card() {
    return (
        <div className = "card">
            <img className = "card-image" src = {profilePic} alt = "alternate text"></img>
            <h2 className = "card-title"> name</h2>
            <p className = "card-text">here goes the description</p>
        </div>
    );
}

export default Card
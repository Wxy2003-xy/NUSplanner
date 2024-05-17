
function functionModule(name: string) {
    if (name == "studyPlan") {
        return (
            <div className = "card">
            <header>
                <h1> {name}</h1>
                <nav>
                    <ul>
                        <li><a href = "">{name}</a></li>
                    </ul>
                </nav>
                <hr></hr>
            </header>
            </div>
        );
    }

    if (name == "timeTableRecommendation") {
        return (
            <header>
                <h1> {name}</h1>
                <nav>
                    <ul>
                        <li><a href = "">{name}</a></li>
                    </ul>
                </nav>
                <hr></hr>
            </header>
        );
    }
    
}

export default functionModule;
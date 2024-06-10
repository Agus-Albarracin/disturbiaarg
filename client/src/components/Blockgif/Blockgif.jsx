import blockgif from "../../assets/blockgifwhite.gif"
import ig from "../../assets/ig.svg"

import "./blockgif.css"

const Blockgif = () => {

    return(
        <>
        <div className="blockgif-container">
            <div className="blockgif">
                <img src={blockgif} className="gif" alt="Block GIF" />
            </div>
            <a href="https://www.instagram.com/disturbiaarg/" target="_blank" className="follow-button">
                <img src={ig} alt="Instagram" className="instagram-icon" />
                <span>Síguenos en las redes</span>
            </a>
        </div>
        </>
    )
}

export default Blockgif
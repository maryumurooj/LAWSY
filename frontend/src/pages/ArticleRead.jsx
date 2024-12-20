import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./ArticleView/ArticleViewNoList.module.css";

const ArticleRead = () => {
    const { fileName } = useParams();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/articles");
    };
    const zoomLevel = 100;

    return (
        <div className={Styles.AVNLcontainer}>  
                <div className={Styles.AVNLbox}>
                <iframe
                    src={`http://localhost:3000/pdfs/${decodeURIComponent(fileName)}.pdf#zoom=${zoomLevel}`}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                />
                </div>
        </div>
    );
};

export default ArticleRead;

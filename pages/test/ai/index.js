import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Test() {
    const canvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    // initCanvas
    useEffect(() => {
        if (!canvasRef) return;
        console.log("init", canvasRef);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, 100, 100);

        // const ctx = canvasRef.current.getContext("2d");
        // const image = new Image();
        // image.src = "http://www.samskirrow.com/background.png";
    
        // ctx.drawImage(image, 0, 0); // image가 성공적으로 load 되지 않은 상태로 drawImage를 실행하면 에러가 발생합니다
    }, [canvasRef]);

    const handleChange = e => {
        // console.log(e.target); 
        const file = e.target.files[0];
        const reader = new FileReader();
        /* const url = */ reader.readAsDataURL(file);
        reader.onloadend = function(e) {
            // console.log(reader.result);
            setImgSrc([reader.result]);
        };
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios({
            method: "post",
            url: "http://3.35.21.124/predict_v1",
            data: {
                school: "school",
                grade: "grade",
                class_name: "class_name",
                image_file: imgSrc[0].split(`;base64,`)[1],
            }
        }).then( ({data: respData}) => {
            console.log(respData);
            const ctx = canvasRef.current.getContext("2d");
            const image = new Image();
            image.src = imgSrc;
        
            ctx.drawImage(image, 0, 0); // image가 성공적으로 load 되지 않은 상태로 drawImage를 실행하면 에러가 발생합니다
            ctx.strokeStyle = "red";
            for (const key in respData) {
                if (Object.hasOwnProperty.call(respData, key)) {
                    const el = respData[key];
                    // console.log(el);
                    ctx.strokeRect(el[0], el[1], el[2], el[3]);
                }
            }
        });
    }

    return (
        <div style={ {padding:100} }>
            <p>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                />
            </p>
            <p><img src={imgSrc} height="64" /></p>
            <p>
                <button
                    type="submit"
                    onClick={handleSubmit}
                >
                    SUBMIT
                </button>
            </p>
            
            <canvas
                ref={canvasRef}
                width={400}
                height={600}
            />
        </div>
    );

};
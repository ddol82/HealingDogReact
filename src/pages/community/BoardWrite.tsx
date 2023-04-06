import CategoryWrite from "components/community/CategoryWrite";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import IconArrowLeft from "../../assets/icon/icon=arrowleft.svg";
import IconArrowRight from "../../assets/icon/icon=arrowright.svg";
import { useNavigate } from "react-router-dom";
import { callBoardRegistAPI } from "apis/BoardAPICalls";

const LIMIT_TITLE_LENGTH = 100;
const LIMIT_CONTENT_LENGTH = 1000;
const LIMIT_PHOTO_AMOUNT = 10;

const BoardWrite = (): JSX.Element => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const imageAttach = useRef<HTMLInputElement>(null);

//state
    const [category, setCategory] = useState(14);
    const [write, setWrite] = useState({
        title: '',
        content: '',
    });
    const [limit, setLimit] = useState({
        title: 0,
        content: 0,
        image: 0
    });
    const [images, setImages] = useState<File[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [warnTitle, setWarnTitle] = useState(false);
    const [warnContent, setWarnContent] = useState(false);

//useEffect
    useEffect(() => {
        refreshImage();
    }, [images]);

//function
    const onBoardCreateClick = (): void => {
        /*
            categoryCode: number,
            title: string,
            content: string,
            imageList: File[],
            imageURLList: string[]
        */
        console.log('게시글 생성 시도');
        const boardData: string = JSON.stringify({
            boardCategoryCode: category,
            title: write.title,
            content: write.content
        });
        const formData = new FormData();
        //formData.append('boardData', new Blob([boardData], {type: 'application/json'}));
        formData.append('boardData', new Blob([boardData], {type : 'application/json'}));
        for(const image of images) {
            formData.append('images', image);
        }

        for(const keyItem of formData.keys()) {
            console.log(`key : ${keyItem}`);
        }
        for(const value of formData.values()) {
            console.log(`value : ${value}`);
        }
        
        
        dispatch<any>(callBoardRegistAPI({
            form: formData
        }));
        
        console.log('게시글 생성 종료');
        navigate('/community/lists/all/1', {replace: true});
        window.location.reload();
    }

    const onImageAttachClick = (): void => {
        imageAttach.current?.click();
    }

    const onImageMoveClick = (from: number, to: number): void => {
        const imagesTmp = [...images];
        const urlsTmp = [...urls];
        
        [imagesTmp[from], imagesTmp[to]] = [imagesTmp[to], imagesTmp[from]];
        [urlsTmp[from], urlsTmp[to]] = [urlsTmp[to], urlsTmp[from]];
        
        setUrls(urls);
        setImages(imagesTmp);
    }

    const onImageRemoveClick = (target: number): void => {
        setImages(images.filter((_: File, idx: number): boolean => idx !== target));
        setUrls(urls.filter((_: string, idx: number): boolean => idx !== target));
        setLimit({
            ...limit,
            image: limit.image - 1
        })
    }

    //비동기 방식인 파일 읽기를 기다리기 위해 Promise 함수를 사용한 Fileread 시작
    async function refreshImage(): Promise<void> {
        const urlTmps: string[] = [];
        for(const image of images) {
            urlTmps.push(await readFileAsync(image));
        }
        setUrls(urlTmps);
    }
    function readFileAsync(file: File): Promise<string> {
        return new Promise((res: (value: string) => void, rej: (reason: any) => void): void => {
            const fileReader = new FileReader();
            fileReader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    if(!e.target) throw new Error('e.target is null!');
                    const urlGet = e.target.result as string
                    res(urlGet);
                } catch(err) {
                    rej(err);
                }
            }
            fileReader.readAsDataURL(file);
        });
    }
    //비동기 방식인 파일 읽기를 기다리기 위해 Promise 함수를 사용한 Fileread 끝

    const onImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if(e.target.files === null) return;
        const imageList: FileList = e.target.files;

        const imageTmp: File[] = [];
        let imageCount: number = limit.image;
        Array.from(imageList).forEach((file: File) => {
            if(imageCount === 10) return;
            imageTmp.push(file);
            imageCount += 1;
        });
        setImages([...images, ...imageTmp]);
        setLimit({
            ...limit,
            image: imageCount
        });
    }

    const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        switch(e.target.name) {
            case 'title':
                if(e.target.value.length > LIMIT_TITLE_LENGTH) {
                    setWarnTitle(true);
                    return;
                }
                setWarnTitle(false);
                break;
            case 'content':
                if(e.target.value.length > LIMIT_CONTENT_LENGTH) {
                    setWarnContent(true);
                    return;
                }
                setWarnContent(false);
                break;
        }
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
        setWrite({
            ...write,
            [e.target.name]: e.target.value
        })
        setLimit({
            ...limit,
            [e.target.name]: e.target.value.length
        })
    }

//parts
const Menu = (): JSX.Element => (
    <div className='com-menu'>
        <div className='category-item cat-left'>
            <p className='category-text'>게시글 작성</p>
        </div>
        <div className='category-item cat-right'>
            <button className='category-btn btn-active' onClick={onBoardCreateClick}>작성 완료</button>
        </div>
    </div>
);

    return (
        <div className="com-container com-write-container">
            <Menu/>
            <CategoryWrite category={category} setCategory={setCategory}/>
            <div className="com-write">
                <div className="write-border">
                    <div className="write-block">
                        <p className={`write-limit${warnTitle ? ' write-warning' : ''}`}>글자 수 : {limit.title} / {LIMIT_TITLE_LENGTH}</p>
                        <input
                            type="text"
                            name="title"
                            className="write-text"
                            placeholder="제목을 입력해주세요."
                            value={write.title}
                            onChange={ onInputChangeHandler }
                        />
                    </div>
                </div>
                <div className="write-border">
                    <div className="write-block">
                        <p className={`write-limit${warnContent ? ' write-warning' : ''}`}>글자 수 : {limit.content} / {LIMIT_CONTENT_LENGTH}</p>
                        <textarea
                            name="content"
                            className="write-text write-textarea"
                            placeholder="내용을 입력해주세요."
                            value={write.content}
                            onChange={ onInputChangeHandler }
                        ></textarea>
                    </div>
                    <div className="write-image-block">
                        <div className="write-image-insert">
                            <div className='category-btn btn-active' onClick={(onImageAttachClick)}>사진 첨부</div>
                            <input
                                style={{display: 'none'}}
                                type="file"
                                name="fileItem"
                                multiple
                                accept="image/jpg,image/png,image/jpeg,image/gif"
                                ref={ imageAttach }
                                onChange={ onImageUploadChange }
                            />
                            <p className={'write-limit'}>사진 : {limit.image} / {LIMIT_PHOTO_AMOUNT}</p>
                        </div>
                        <div className="write-image-list">
                        {
                            urls?.map((urlstr: string, idx: number): JSX.Element => (
                                <div key={idx} className={`write-image-item${idx === 0 ? ' write-image-thumbnail' : ''}`}>
                                    <img src={urlstr} alt="attachment"/>
                                    {
                                        idx === 0 &&
                                        <div className="write-icon write-thumbnail">대표</div>
                                    }
                                    <div className="write-icon write-remove" onClick={() => onImageRemoveClick(idx)}>X</div>
                                    {
                                        idx > 0 &&
                                        <div className="write-icon write-left" onClick={() => onImageMoveClick(idx, idx-1)}>
                                            <img src={IconArrowLeft} alt="moveLeft" />
                                        </div>
                                    }
                                    {
                                        idx < limit.image-1 &&
                                        <div className="write-icon write-right" onClick={() => onImageMoveClick(idx, idx+1)}>
                                            <img src={IconArrowRight} alt="moveRight" />
                                        </div>
                                    }
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardWrite;
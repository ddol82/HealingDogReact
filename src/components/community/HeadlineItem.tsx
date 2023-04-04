import { callGetHeadlineAPI } from "apis/HeadlineAPICalls";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/Community.css";
import IconAfterLogin from "../../assets/icon/Login=true.svg";
import { BoardSimple } from "./types/BoardSimple";

const HeadlineItem = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const headlineList: BoardSimple[] = useSelector((state: any) => state.headlineReducer);

//effect
    useEffect(() => {
        dispatch<any>(callGetHeadlineAPI());
    // eslint-disable-next-line
    }, [])

    const Headline = ({boardCategoryName, title, profileName, uptime, view, like}: BoardSimple):JSX.Element => (
        <div className="headline-content">
            <p className="headline-category">{boardCategoryName}</p>
            <div className="headline-title-block">
                <p className="headline-title-text">{title}</p>
            </div>
            <div className="headline-info">
                <div className="community-profile">
                    <img className="img-profile" src={IconAfterLogin} alt="profile"/>
                    <p className="text-profile-name">{profileName}</p>
                </div>
                <p>{uptime}</p>
                <p>조회 {view}</p>
                <p>좋아요 {like}</p>
                <p>댓글 999</p>
            </div>
        </div>
    );

    return (
        <div className="headline-area">
        {
            Array.isArray(headlineList) && headlineList.map((headline: BoardSimple) => (
                <Headline key={headline.boardCode}
                    boardCategoryName={headline.boardCategoryName}
                    title={headline.title}
                    profileName={headline.profileName}
                    uptime={headline.uptime}
                    view={headline.view}
                    share={headline.share}
                    like={headline.like}
                />
            ))
        }
        </div>
    );
};

export default HeadlineItem;
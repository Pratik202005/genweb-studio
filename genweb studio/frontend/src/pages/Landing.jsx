import Introduction from "../components/Introduction";
import Prompt from "../components/Prompt";

const Landing = () => {
    return (
        <div className="relative w-full flex flex-col items-center z-10">
            <Introduction />
            <Prompt />
        </div>
    );
};

export default Landing;
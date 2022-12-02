import imgIcon from "../assets/imgIcon.svg";
import srtIcon from "../assets/srtIcon.svg";
import videoIcon from "../assets/videoIcon.svg";
import networkErrorIcon from "../assets/networkErrorIcon.svg";
import networkErrorIconLight from "../assets/networkErrorIcon-light.svg";

export default async () => {
    [imgIcon, srtIcon, videoIcon, networkErrorIcon, networkErrorIconLight].forEach((src) => {
        const link = document.createElement("link");
        link.setAttribute("rel", "prefetch");
        link.setAttribute("as", "image");
        link.href = src;
        link.style.display = "none";
        document.body.append(link);
    });
};

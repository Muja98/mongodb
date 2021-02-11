import { Paragraph } from "./paragraph"
import { Survey } from "./survey" 
import { Chart } from "./chart"
import { Comment } from "./comment";

export class News 
{
    id:string = "";
    title:string = "";
    dateTime:string = "";
    mainPicturePath:string = "";
    field:string = "";
    paragraphs:Paragraph[] = [];
    tags:string[] = [];
    survey:Survey = null;
    chart:Chart = null;
    comments:Comment[] = [];
}
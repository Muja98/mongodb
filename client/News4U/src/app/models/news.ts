import { Paragraph } from "./paragraph"

export class News 
{
    id:string = "";
    title:string = "";
    dateTime:string = "";
    mainPicturePath:string = "";
    field:string = "";
    paragraphs:Paragraph[] = [];
    
}
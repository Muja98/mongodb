import { NewsService } from 'src/app/services/news.service';
import { TestBed } from '@angular/core/testing';
import { Paragraph } from './../../models/paragraph';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-paragraph',
  templateUrl: './create-paragraph.component.html',
  styleUrls: ['./create-paragraph.component.css']
})

export class CreateParagraphComponent implements OnInit {
    public subTitle:string;
    public text:string;
    public picturePath:string;

    base64textString = [];
    imagePom:any;
    image:string;

    public filedArray: Array<string> = [];

    @Output() changed =  new EventEmitter<string> ();

    constructor() { }
   
    ngOnInit(): void {
        console.log("onInit method");
    }

    onUploadChange(evt: any) {
      const file = evt.target.files[0];
    
      if (file) {
        this.base64textString = []
        const reader = new FileReader();
    
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }

    handleReaderLoaded(e) {
      let array =  [];
  
      array.push(btoa(e.target.result))
      this.imagePom = array[0];
      
      this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
      this.image=this.base64textString[0];
    }

    handleParagraphCreate():void {
      var paragraph;

      paragraph.subTitle = this.subTitle;
      paragraph.text = this.text;
      paragraph.picturePath = this.image;

      this.changed.emit(paragraph);
    }
}

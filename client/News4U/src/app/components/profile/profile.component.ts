import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user:any;
  public edit:boolean = true;
  constructor(private aservice:AuthenticationService, private aroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.aroute.paramMap.subscribe(url=>{
      if(url.get('editorId')===null)
        this.user = this.aservice.getStudentFromStorage();
      else
      {
        this.edit = false;
        this.aservice.getStudent(url.get('editorId')).subscribe((editor:any)=>{
          this.user = editor;
        })
      }
    })

  }

}

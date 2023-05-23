import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { Post } from 'src/app/interface/post.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  
  postForm: FormGroup;
  isUpdating: boolean = false;
  categories: string[] = ['Life Style', 'Hobbies', 'Home', 'Travel', 'Pet'];

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      photos: [[]],
      date: [new Date()],
      comments: [[]]
    });
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.postForm.patchValue({ photos: Array.from(files) });
  
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.files.push({
          name: file.name,
          size: file.size,
          progress: 0,
          dataURL: (e.target as FileReader).result as string
        });
      };
      reader.readAsDataURL(file);
    }
  
    this.fileDropEl.nativeElement.value = "";
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
  }

  savePost(): void {
    if (this.postForm.valid) {
      const post: Post = this.postForm.value;
      const files: File[] = this.postForm.get('photos').value;
  
      this.postService.createPostWithPhoto(post, files).subscribe(
        () => {
          console.log('Post and photos created successfully');
          this.router.navigate(['/posts']);
        },
        (error) => {
          console.error('Error creating post with photos:', error);
        }
      );
    }
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }
}


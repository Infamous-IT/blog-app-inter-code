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
    this.isUpdating = this.route.snapshot.params['id'] !== undefined;

    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      photos: [[]],
      date: [new Date()],
      comments: [[]]
    });

    if (this.isUpdating) {
      this.getPostById();
    }
  }

  onFileDropped($event) {
    const files = $event;

    this.postForm.patchValue({ photos: files });

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.files.push((e.target as FileReader).result as string);
      };
      reader.readAsDataURL(files[i]);
    }
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

      if (this.isUpdating) {
        const postId = this.route.snapshot.params['id'];
        this.postService.updatePost(postId, post).subscribe(
          () => {
            console.log('Post and photos updated successfully');
            this.router.navigate(['/posts']);
          },
          (error) => {
            console.error('Error updating post with photos:', error);
          }
        );
      } else {
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
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }

  private getPostById(): void {
    const postId = this.route.snapshot.params['id'];
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        this.postForm.patchValue(post);
        this.files = post.photos.map(photo => ({
          name: photo,
          progress: 100,
          dataURL: photo
        }));
      },
      (error) => {
        console.error('Error retrieving post:', error);
      }
    );
  }
}

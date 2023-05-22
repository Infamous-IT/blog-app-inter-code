// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { PostService } from 'src/app/service/post.service';
// import { Post } from 'src/app/interface/post.interface';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-create',
//   templateUrl: './create.component.html',
//   styleUrls: ['./create.component.css']
// })
// export class CreateComponent implements OnInit {

//   postForm: FormGroup;
//   isUpdating: boolean = false;
//   categories: string[] = ['Life Style', 'Hobbies', 'Home', 'Travel', 'Pet'];

//   constructor(
//     private formBuilder: FormBuilder,
//     private postService: PostService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.postForm = this.formBuilder.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       category: ['', Validators.required],
//       photos: [[]],
//       date: [new Date()],
//       comments: [[]]
//     });
//   }

//   savePost(): void {
//     if (this.postForm.valid) {
//       const post: Post = this.postForm.value;
//       this.postService.createPost(post).subscribe(
//         () => {
//           console.log(post);
//           this.router.navigate(['/posts']);
//         },
//         (error) => {
//           console.error('Error creating post:', error);
//         }
//       );
//     }
//   }

//   backToHomePage() {
//     this.router.navigate(['/']);
//   }
// }

import { Component, OnInit } from '@angular/core';
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

  savePost(): void {
    if (this.postForm.valid) {
      const post: Post = this.postForm.value;
      this.postService.createPost(post).subscribe(
        (newPost: Post) => {
          const postId = newPost.id;
          const files = this.postForm.get('photos').value;
          this.postService.createPostWithPhoto(postId, files).subscribe(
            () => {
              console.log('Post and photos created successfully');
              console.log(files)
              this.router.navigate(['/posts']);
            },
            (error) => {
              console.error('Error uploading photos:', error);
            }
          );
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    }
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }
}


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/service/post.service';
import { Post } from 'src/app/interface/post.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  post: Post = {
    title: '',
    description: '',
    category: '',
    photos: [],
    date: new Date(), 
    comments: []
  };

  constructor(private postService: PostService, private router: Router) {}

  savePost(): void {
    this.postService.createPost(this.post).subscribe(() => {
      this.router.navigate(['/posts']);
    });
  }

  backToHomePage() {
    this.router.navigate(['/']);
  }
}

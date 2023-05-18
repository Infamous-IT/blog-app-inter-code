import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts$: Observable<Post[]>;
  category: string;

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit():void {
    this.posts$ = this.route.queryParamMap.pipe(
      switchMap(params => {
        const category = params.get('category');
        return this.getPostsByCategory(category);
      })
    );
  }

  getPostsByCategory(category: string): Observable<Post[]> {
    if (category) {
      return this.postService.searchPosts(category);
    } else {
      return this.postService.getPosts();
    }
  }

  getPhotoSrc(photo: any): string {
    return this.postService.getPhotoSrc(photo);
  }
  
  viewDetails(post: any) {
    const postId = post['_id'];
    this.router.navigate(['post', postId]);
  }
}
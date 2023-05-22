import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent  {

  posts$: Observable<Post[]> = this.route.queryParamMap.pipe(
    switchMap(params => {
      const category = params.get('category');
      return this.getPostsByCategory(category);
    })
  );
  category: string;

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {}

  getPostsByCategory(category: string): Observable<Post[]> {
    if (category) {
      return this.postService.searchPosts(category);
    } else {
      return this.postService.getPosts()
    }
  }

  getPhotoSrc(photo: any ): string {
    return this.postService.getPhotoSrc(photo);
  }

  viewDetails(post: any) {
    const postId = post['_id'];
    this.router.navigate(['post', postId]);
  }
}

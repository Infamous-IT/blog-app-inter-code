
import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';
import { Observable } from 'rxjs';
import {FilterService} from "../../service/filter.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

  filteredPosts: Post[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  titleControl = new FormControl();
  descriptionControl = new FormControl();
  searchSubscription: Subscription;

  showScrollToTopButton = false;

  constructor(private postService: PostService,
              private filterService: FilterService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.searchSubscription = this.titleControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.performSearch(value, 'title');
    });

    this.descriptionControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.performSearch(value, 'description');
    });

    this.route.queryParamMap.pipe(
      switchMap(params => {
        const category = params.get('category');
        return this.getPostsByCategory(category);
      })
    ).subscribe(posts => {
      this.filteredPosts = posts;
    });

    this.range.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performDateRangeSearch();
    });

    this.filterService.filterReset.subscribe(() => {
      this.resetFilter();
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
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

  performSearch(value: string, searchBy: 'title' | 'description') {
    let title: string = '';
    let description: string = '';

    if (searchBy === 'title') {
      title = value;
    } else if (searchBy === 'description') {
      description = value;
    }

    if (value.trim() === '') {
      this.getPostsByCategory(null).subscribe(posts => {
        this.handleSearchResults(posts);
        console.log(posts);
      }, error => {
        console.error(error);
      });
    } else {
      this.postService.searchPostsByTitleOrDescription(title, description).subscribe(posts => {
        this.handleSearchResults(posts);
        console.log(posts);
      }, error => {
        console.error(error);
      });
    }
  }

  performDateRangeSearch() {
    const startDate = this.range.get('start').value;
    const endDate = this.range.get('end').value;
    if (startDate && endDate) {
      this.postService.sortByDateRangePicker(startDate, endDate).subscribe(posts => {
        console.log(this.handleSearchResults(posts));
        this.handleSearchResults(posts);
      }, error => {
        console.log(error);
      });
    }
  }

  resetFilter() {
    this.range.setValue({ start: null, end: null });
    this.titleControl.setValue('');
    this.descriptionControl.setValue('');
    this.getPostsByCategory(null).subscribe(posts => {
      this.handleSearchResults(posts);
    }, error => {
      console.error(error);
    });
  }

  handleSearchResults(posts: Post[]) {
    this.filteredPosts = posts;
    console.log(this.filteredPosts);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollToTopButton = window.pageYOffset > 0;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

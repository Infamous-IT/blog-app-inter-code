import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Post } from 'src/app/interface/post.interface';
import { PostService } from '../../service/post.service';
import { FilterService } from '../../service/filter.service';

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
  sortOrder: string = 'asc';

  constructor(
    private postService: PostService,
    private filterService: FilterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchSubscription = this.titleControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.performSearch('title', value);
      });

    this.descriptionControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.performSearch('description', value);
      });

    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          const category = params.get('category');
          return this.getPostsByCategory(category);
        })
      )
      .subscribe((posts) => {
        this.filteredPosts = posts;
      });

    this.range.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.performDateRangeSearch();
      });

    this.filterService.filterReset.subscribe(() => {
      this.resetFilter();
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  getPostsByCategory(category: string) {
    const query = { category };
    return this.postService.filterPosts(query);
  }

  getPhotoSrc(photo: any): string {
    return this.postService.getPhotoSrc(photo);
  }

  viewDetails(post: any) {
    const postId = post['_id'];
    this.router.navigate(['post', postId]);
  }

  performSearch(searchBy: 'title' | 'description', value: string) {
    const query: any = {};

    if (searchBy === 'title') {
      query.title = value;
    } else if (searchBy === 'description') {
      query.description = value;
    }

    if (value.trim() === '') {
      this.getPostsByCategory(null).subscribe(
        (posts) => {
          this.handleSearchResults(posts);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.postService.filterPosts(query).subscribe(
        (posts) => {
          this.handleSearchResults(posts);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  performDateRangeSearch() {
    const startDate = this.range.get('start').value;
    const endDate = this.range.get('end').value;

    if (startDate && endDate) {
      const query: any = {};

      query.startDate = startDate.toISOString();
      query.endDate = endDate.toISOString();

      this.postService.filterPosts(query).subscribe(
        (posts) => {
          this.handleSearchResults(posts);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  handleSearchResults(posts: Post[]) {
    this.filteredPosts = posts;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: { category: null },
    });
  }

  resetFilter() {
    this.titleControl.setValue('');
    this.descriptionControl.setValue('');
    this.range.reset();
    this.filteredPosts = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: { category: null },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset = window.pageYOffset;
    const threshold = 500;
    this.showScrollToTopButton = yOffset > threshold;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeSortOrder(order: string) {
    this.sortOrder = order;
    // Perform sorting logic here
  }

  sortPostsByCreationDate() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.filteredPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
}


import { Observable } from 'tns-core-modules/data/observable';
import {
  RadListView,
  SwipeActionsEventData,
  ListViewEventData
} from 'nativescript-ui-listview';
import { View } from 'tns-core-modules/ui/core/view';
import { layout } from 'tns-core-modules/utils/utils';
import { TextField } from 'tns-core-modules/ui/text-field';
import { TextView } from 'tns-core-modules/ui/text-view';
import { TapticEngine } from 'nativescript-taptic-engine';

const topmost = require('tns-core-modules/ui/frame').topmost;

import { SelectedPageService } from '../shared/selected-page-service';

interface Note {
  title: string;
  text: string;
}

export class NotesViewModel extends Observable {
  constructor() {
    super();
    SelectedPageService.getInstance().updateSelectedPage('Notes');
  }

  allNotes: Array<Note> = require('./notes.json');
  notes = this.allNotes;
  newTitle: string = '';
  newText: string = '';
  leftThresholdPassed: boolean = false;
  rightThresholdPassed: boolean = false;
  editIndex: number = -1;

  showDialog() {
    const page = topmost().currentPage;
    page.className = 'page dialogOpen';
  }

  closeDialog() {
    if (this.newTitle.length > 0 && this.newText.length > 0) {
      const _newNote: Note = {
        title: this.newTitle,
        text: this.newText
      };
      if (this.editIndex == -1) {
        this.notes.push(_newNote);
      } else {
        this.notes[this.editIndex] = _newNote;
      }
    }

    const page = topmost().currentPage;
    let listView = <RadListView>page.getViewById('list-view');
    listView.refresh();

    page.className = 'page';

    this.set('newTitle', '');
    this.set('newText', '');
    this.set('editIndex', -1);
  }

  cancelDialog() {
    const page = topmost().currentPage;
    page.className = 'page';

    this.set('newTitle', '');
    this.set('newText', '');
    this.set('editIndex', -1);
  }

  onItemSwiping(args: SwipeActionsEventData) {
    const swipeView = args.swipeView;
    const mainView = args.mainView;
    const leftItem = swipeView.getViewById<View>('swipe-edit');
    const rightItem = swipeView.getViewById<View>('swipe-delete');

    if (
      args.data.x > swipeView.getMeasuredWidth() / 4 &&
      !this.leftThresholdPassed
    ) {
      //console.log('Notify perform left action');
      this.leftThresholdPassed = true;
    } else if (
      args.data.x < -swipeView.getMeasuredWidth() / 4 &&
      !this.rightThresholdPassed
    ) {
      //console.log('Notify perform right action');
      this.rightThresholdPassed = true;
    }
    if (args.data.x > 0) {
      const leftDimensions = View.measureChild(
        <View>leftItem.parent,
        leftItem,
        layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
        layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY)
      );
      View.layoutChild(
        <View>leftItem.parent,
        leftItem,
        0,
        0,
        leftDimensions.measuredWidth,
        leftDimensions.measuredHeight
      );
    } else {
      const rightDimensions = View.measureChild(
        <View>rightItem.parent,
        rightItem,
        layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
        layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY)
      );

      View.layoutChild(
        <View>rightItem.parent,
        rightItem,
        mainView.getMeasuredWidth() - rightDimensions.measuredWidth,
        0,
        mainView.getMeasuredWidth(),
        rightDimensions.measuredHeight
      );
    }
  }

  onSwipeItemStarted(args: SwipeActionsEventData) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args.swipeView;
    swipeLimits.left = swipeLimits.right =
      args.data.x > 0
        ? swipeView.getMeasuredWidth() / 2
        : swipeView.getMeasuredWidth() / 2;
    swipeLimits.threshold = swipeView.getMeasuredWidth();
  }

  onSwipeItemFinished(args: SwipeActionsEventData) {
    const page = topmost().currentPage;
    // adding a taptic tap on iOS, just for fun :)
    let tapticEngine = new TapticEngine();

    if (this.leftThresholdPassed) {
      // edit
      tapticEngine.selection();
      this.showDialog();
      this.set('newTitle', this.notes[args.index].title);
      this.set('newText', this.notes[args.index].text);
      this.set('editIndex', args.index);
    } else if (this.rightThresholdPassed) {
      // delete
      tapticEngine.selection();
      this.notes.splice(args.index, 1);
      let listView = <RadListView>page.getViewById('list-view');
      listView.refresh();
    }
    this.leftThresholdPassed = false;
    this.rightThresholdPassed = false;
  }

  onItemReordered(args: ListViewEventData) {
    // console.log('Old index: ' + args.index);
    // console.log('new index: ' + args.data.targetIndex);

    // TODO: this array re-ordering is not working correctly
    this.notes.splice(
      args.data.targetIndex,
      0,
      this.notes.splice(args.index, 1)[0]
    );
  }
}

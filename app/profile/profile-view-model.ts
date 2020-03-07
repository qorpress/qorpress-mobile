import { Observable } from 'tns-core-modules/data/observable';
import * as imagepicker from 'nativescript-imagepicker';
import { ItemEventData } from 'tns-core-modules/ui/list-view';
import { Label } from 'tns-core-modules/ui/label';
const topmost = require('tns-core-modules/ui/frame').topmost;

import { SelectedPageService } from '../shared/selected-page-service';

export class ProfileViewModel extends Observable {
  constructor() {
    super();
    SelectedPageService.getInstance().updateSelectedPage('Profile');
  }

  private _imageSrc: any;
  private _imageAssets: Array<any>;
  private _isSingleMode: boolean;

  get thumbSize(): any {
    return 80;
  }

  get previewSize(): any {
    return 80;
  }

  get imageSrc(): any {
    return this._imageSrc;
  }

  set imageSrc(value: any) {
    if (this._imageSrc !== value) {
      this._imageSrc = value;
      this.notifyPropertyChange('imageSrc', value);
    }
  }

  get imageAssets(): any {
    return this._imageAssets;
  }

  set imageAssets(value: any) {
    if (this._imageAssets !== value) {
      this._imageAssets = value;
      this.notifyPropertyChange('imageAssets', value);
    }
  }

  get isSingleMode(): any {
    return this._isSingleMode;
  }

  set isSingleMode(value: any) {
    if (this._isSingleMode !== value) {
      this._isSingleMode = value;
      this.notifyPropertyChange('isSingleMode', value);
    }
  }

  public onItemLoading(args: ItemEventData) {
    let label = args.view.getViewById<Label>('imageLabel');
    label.text = 'image ' + args.index;
  }

  public onSelectMultipleTap(args) {
    this.isSingleMode = false;
    let context = imagepicker.create({
      mode: 'multiple'
    });
    this.startSelection(context);
  }

  public onSelectSingleTap(args) {
    this.isSingleMode = true;
    let context = imagepicker.create({ mode: 'single' });
    this.startSelection(context);
  }

  private startSelection(context) {
    context
      .authorize()
      .then(() => {
        this.imageAssets = [];
        this.imageSrc = null;
        return context.present();
      })
      .then(selection => {
        console.log('Selection done: ' + JSON.stringify(selection));
        this.imageSrc =
          this.isSingleMode && selection.length > 0 ? selection[0] : null;

        // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
        selection.forEach(element => {
          element.options.width = this.isSingleMode
            ? this.previewSize
            : this.thumbSize;
          element.options.height = this.isSingleMode
            ? this.previewSize
            : this.thumbSize;
        });

        this.imageAssets = selection;
      })
      .catch(function(e) {
        console.log(e);
      });
  }

  genderMale() {
    const page = topmost().currentPage;
    let genderMale = page.getViewById('genderMale');
    let genderFemale = page.getViewById('genderFemale');

    genderMale.className = 'btn btn-primary';
    genderFemale.className = 'btn btn-outline';
  }

  genderFemale() {
    const page = topmost().currentPage;
    let genderMale = page.getViewById('genderMale');
    let genderFemale = page.getViewById('genderFemale');

    genderMale.className = 'btn btn-outline';
    genderFemale.className = 'btn btn-primary';
  }

  showDialog() {
    const page = topmost().currentPage;
    page.className = 'page dialogOpen';
  }

  closeDialog() {
    const page = topmost().currentPage;
    page.className = 'page';
  }
}

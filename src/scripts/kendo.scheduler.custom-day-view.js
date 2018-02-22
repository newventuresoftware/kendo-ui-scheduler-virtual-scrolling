var scheduling = scheduling || {};

(function ($, kendo) {
    'use strict';

    var persistedData = {};

    scheduling.CustomDayView = kendo.ui.DayView.extend({
        name: 'virtual-scroll-day-view',
        nvsVirtualScrollBarId: 'virtual-scroll-day-view-resources-scroll-bar',
        init: function (element, options) {
            var that = this;
            kendo.ui.SchedulerView.fn.init.call(that, element, options);

            // sets the persistedData object as part of the view object as it's easier to use it later in the code
            this.nvsPersistedData = persistedData;
            // handles the persisted and presented data for the current initialization cycle
            this.nvsPrepareForViewInitialization();

            that.title = that.options.title || that.options.name;
            that._workDays = getWorkDays(that.options);
            that._templates();
            that._editable();
            that.calculateDateRange();
            that._groups();
            that._currentTime(true);
        },
        _render: function (dates) {
            var that = this;
            dates = dates || [];
            this._dates = dates;
            this._startDate = dates[0];
            this._endDate = dates[dates.length - 1 || 0];
            this.createLayout(this._layout(dates));
            this._content(dates);
            this._footer();

            // additional scrollbar for the virtual scroll
            if (!$('#' + this.nvsVirtualScrollBarId).length) {
                this.nvsAppendScrollBarForVirtualScrolling();
                this.nvsAdjustScrollBarWidthAccordingToWindowResizing();
                this.nvsBindScrollingToResourceDisplaying();
            }

            this.refreshLayout();
            var allDayHeader = this.element.find('.k-scheduler-header-all-day td');
            if (allDayHeader.length) {
                this._allDayHeaderHeight = allDayHeader.first()[0].clientHeight;
            }
            that.element.on('click' + '.kendoMultiDayView', '.k-nav-day', function (e) {
                var slot = new Date($(e.target).attr('data-target-date'));
                that.trigger('navigate', {
                    view: 'Day',
                    date: slot
                });
            });
        },
        // custom functions prefixed with 'nvs' to avoid collisions with kendo code that could be added in future releases
        nvsPrepareForViewInitialization: function () {
            // stores the original set of resources on first load
            if (!this.nvsPersistedData.resources) {
                this.nvsPersistedData.resources = this.options.resources[0].dataSource.data();
            }

            // resets the resourcesStartIndex (used for slicing the data) to 0 and restores the scroll to its initial position
            if (!this.nvsPersistedData.keepData) {
                this.nvsPersistedData.resourcesStartIndex = 0;
                $('#' + this.nvsVirtualScrollBarId).scrollLeft(0);
            }

            // the keepData flag is set to true when the initialization of the view is triggered by the virtual scrolling
            this.nvsPersistedData.keepData = false;

            // altering the resources dataSource to hold only a few resources
            var targetResources = this.nvsPersistedData.resources.slice(this.nvsPersistedData.resourcesStartIndex, this.nvsPersistedData.resourcesStartIndex + this.options.numberOfResourcesDisplayed);
            this.options.resources[0].dataSource.data(targetResources);
        },
        nvsAppendScrollBarForVirtualScrolling: function () {
            // the scrollbar width is composed by the size of the header cell holding each resource title multiplied by the total number of resources, with the excess width from either side of the entire header added as well
            var scrollBarWidth = ($('.k-scheduler-header-wrap').width() / this.options.numberOfResourcesDisplayed) * this.nvsPersistedData.resources.length + (this.element.width() - $('.k-scheduler-header-wrap').width());
            var resourcesScrollBar = '<div id="' + this.nvsVirtualScrollBarId + '" style="overflow-x: auto; overflow-y: hidden;"><div style="width:' + scrollBarWidth + 'px; height: 1px;">&nbsp;</div></div>';
            this.element.after(resourcesScrollBar);
        },
        nvsBindScrollingToResourceDisplaying: function () {
            var view = this;
            var debounceTimeout = 5;
            $('#' + this.nvsVirtualScrollBarId).scroll($.debounce(debounceTimeout, function (event) {
                // the start index for the resources is calculated in the event handler as it depends on the rendered layout
                view.nvsCalculateNextStartIndex(event.target.scrollLeft);

                // the vertical scroll position is lost during the reinitialization of the view but can be manually restored
                var verticalScrollPosition = $('.k-scheduler-content').scrollTop();

                // the keepData flag indicates that the reinitialization of the view is triggered by the virtual scroll
                view.nvsPersistedData.keepData = true;

                // reinitializes the view for the changes to be displayed
                view.element.data('kendoScheduler').view(view.title);

                // restoring the vertical scroll position
                $('.k-scheduler-content').scrollTop(verticalScrollPosition);
            }));
        },
        nvsCalculateNextStartIndex: function (scrolled) {
            var headerCellWidth = $('.k-scheduler-header-wrap').width() / this.options.numberOfResourcesDisplayed;
            var startIndex = Math.round(scrolled / headerCellWidth);
            this.nvsPersistedData.resourcesStartIndex = this.nvsAdjustStartIndexToFitIntoArrayBounds(startIndex, this.nvsPersistedData.resources.length - this.options.numberOfResourcesDisplayed);
        },
        nvsAdjustStartIndexToFitIntoArrayBounds: function (index, lastPossibleIndex) {
            return index < 0 ? 0 : index > lastPossibleIndex ? lastPossibleIndex : index;
        },
        nvsAdjustScrollBarWidthAccordingToWindowResizing: function () {
            var view = this;
            $(window).resize(function () {
                var headerCellWidth = headerCellWidth = $('.k-scheduler-header-wrap').width() / view.options.numberOfResourcesDisplayed;
                var scrollBarWidth = headerCellWidth * view.nvsPersistedData.resources.length + (view.element.width() - $('.k-scheduler-header-wrap').width());

                $('#' + view.nvsVirtualScrollBarId + '>div').width(scrollBarWidth);
                $('#' + view.nvsVirtualScrollBarId).scrollLeft(view.nvsPersistedData.resourcesStartIndex * headerCellWidth);
            });
        }
    });

    // function copied from the kendo.scheduler.dayview.js file as it is used by the original code in the 'init' function
    function getWorkDays(options) {
        var workDays = [];
        var dayIndex = options.workWeekStart;
        workDays.push(dayIndex);
        while (options.workWeekEnd !== dayIndex) {
            if (dayIndex > 6) {
                dayIndex -= 7;
            } else {
                dayIndex++;
            }
            workDays.push(dayIndex);
        }
        return workDays;
    }

})(window.jQuery, window.kendo);

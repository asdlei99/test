$(function () {
    // init jstree
    var $gTree = $('#user-perms-tree');
    $gTree.jstree({
        'core' : {
            'themes' : {
                'responsive': false
            }
        },
        'types' : {
            'default' : {
                'icon' : 'mdi mdi-note-multiple-outline'
            },
            'file' : {
                'icon' : 'mdi mdi-note-outline'
            }
        },
        'plugins' : ['types', 'checkbox']
    });

    $('#user-detail-update-modal form').submit(function (event) {
        var $this = $(this);
        event.preventDefault();
        $.addLoadingCover();
        $.ajax({
            url: $this.attr('action'),
            data: $this.serialize(),
            type: $this.attr('method'),
            success: function (res) {
                res = $.handleResponse(res);
                if (res.result) {
                    var newEmail = res.data['email'];
                    $('#user-email > span').text(newEmail);
                    $('#user-detail-update-modal').modal('hide');
                    $.cleanFormInput($this);
                }
            },
            complete: function () {
                $.removeLoadingCover();
            },
            error: function () {
            }
        });
    });

    // user resources select
    $('#user-host-multi-select').multiSelect({
        selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
        selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
        selectionFooter: "<div class='text-muted font-13 m-t-10 text-center'>已分配给{0}的资源</div>".format(userName),
        afterInit: function (ms) {
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                .on('keydown', function (e) {
                    if (e.which === 40) {
                        that.$selectableUl.focus();
                        return false;
                    }
                });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                .on('keydown', function (e) {
                    if (e.which === 40) {
                        that.$selectionUl.focus();
                        return false;
                    }
                });
        },
        afterSelect: function () {
            this.qs1.cache();
            this.qs2.cache();
        },
        afterDeselect: function () {
            this.qs1.cache();
            this.qs2.cache();
        }
    });
    $('#user-volume-multi-select').multiSelect({
        selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
        selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
        selectionFooter: "<div class='text-muted font-13 m-t-10 text-center'>已分配给{0}的资源</div>".format(userName),
        afterInit: function (ms) {
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                .on('keydown', function (e) {
                    if (e.which === 40) {
                        that.$selectableUl.focus();
                        return false;
                    }
                });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                .on('keydown', function (e) {
                    if (e.which === 40) {
                        that.$selectionUl.focus();
                        return false;
                    }
                });
        },
        afterSelect: function () {
            this.qs1.cache();
            this.qs2.cache();
        },
        afterDeselect: function () {
            this.qs1.cache();
            this.qs2.cache();
        }
    });
    $('#user-server-multi-select').multiSelect({
        selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
        selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
        selectionFooter: "<div class='text-muted font-13 m-t-10 text-center'>已分配给{0}的资源</div>".format(userName),
        afterInit: function (ms) {
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

            that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                .on('keydown', function (e) {
                    if (e.which === 40) {
                        that.$selectableUl.focus();
                        return false;
                    }
                });

            that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                .on('keydown', function (e) {
                    if (e.which === 40) {
                        that.$selectionUl.focus();
                        return false;
                    }
                });
        },
        afterSelect: function () {
            this.qs1.cache();
            this.qs2.cache();
        },
        afterDeselect: function () {
            this.qs1.cache();
            this.qs2.cache();
        }
    });

    // change group permissions
    $('#user-perms-update-btn').click(function () {
        var data = $gTree.jstree().get_checked();
        var jsonData = JSON.stringify(data);
        $.addLoadingCover();
        $.ajax({
            url: userPermsUrl,
            data: {'checked_perms': jsonData},
            type: 'POST',
            success: function (res) {
                $.handleResponse(res, true);
                $('#user-perms-modal').modal('hide');
            },
            complete: function () {
                $.removeLoadingCover();
            }
        });

    });

    $('#delete-user').click(function (event) {
        Swal({
            title: 'Are you sure?',
            text: "User {0} will be deleted, and all resources ".format(userName) +
            "and perms assigned to the user will be removed!",
            type: 'warning',
            showCancelButton: true,
            // confirmButtonColor: '#4fa7f3',
            // cancelButtonColor: '#d57171',
            confirmButtonText: 'Yes, delete it.',
            confirmButtonClass: 'btn btn-danger m-l-10',
            cancelButtonClass: 'btn btn-success'
        }).then(function (result) {
            if (result.value) {
                $.addLoadingCover();
                $.ajax({
                    url: userDeleteUrl,
                    type: 'POST',
                    success: function (res) {
                        $.handleResponse(res, userListUrl);
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {}

        });
    });

    $('#password-change-modal').on('shown.bs.modal', function () {
        $(this).find('#old-password-input').focus();
    }).find('form').submit(function (event) {
        var $this = $(this);
        event.preventDefault();
        $.addLoadingCover();
        $.ajax({
            url: $this.attr('action'),
            data: $this.serialize(),
            type: $this.attr('method'),
            success: function (res) {
                res = $.handleResponse(res, true);
                // whether if logout ?
            },
            complete: function () {
                $.removeLoadingCover();
            }
        });
    });
});
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js'

import template from './todosList.html';

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('tasks');

        this.hideCompleted = false;

        this.helpers({
            tasks() {
                const selector = {};

                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                return Tasks.find(selector, { 
                    sort: {
                        createdAt: -1
                    }
                });
            },
            incompleteCount() {
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }).count();
            },
            currentUser() {
                return Meteor.user(); 
            }
        })
    }

    addTask(newTask) {
        Meteor.call('tasks.insert', newTask);
        // Clear form
        this.newTask = '';
    }

    removeTask(task) {
        Meteor.call('tasks.remove', task._id);
    }

    setChecked(task) {
        Meteor.call('tasks.setChecked', task._id, !task.checked)
    }

    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}

export default angular.module('todosList', [
    angularMeteor
]).component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
});
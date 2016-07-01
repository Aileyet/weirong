/**
 * Created by Administrator on 2016/6/29.
 */
/*backbone practice*/


$(function () {
    //定义模型
    var Add = Backbone.Model.extend({
        default:function () {

        }
    });
    var add = new Add;

    //定义模型集合
    var AddList = Backbone.Collection.extend({
        model:Add

    });
    var addList = new AddList;
})
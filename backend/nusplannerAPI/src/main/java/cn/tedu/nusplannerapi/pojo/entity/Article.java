package cn.tedu.nusplannerapi.pojo.entity;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class Article {
    @ApiModelProperty(value = "articleId")
    private Long id;
    @ApiModelProperty(value = "title")
    private String title;
    @ApiModelProperty(value = "content")
    private String content;
    @ApiModelProperty(value = "createdTime")
    private Date createTime;
    @ApiModelProperty(value = "thumbsup")
    private int thumbsup;
    @ApiModelProperty(value = "dislike")
    private int dislike;
}

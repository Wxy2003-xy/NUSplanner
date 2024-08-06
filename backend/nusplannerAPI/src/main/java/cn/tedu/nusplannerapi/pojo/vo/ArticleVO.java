package cn.tedu.nusplannerapi.pojo.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ArticleVO {
    @ApiModelProperty(value = "articleId")
    private Long id;
    @ApiModelProperty(value = "title")
    private String title;
    @ApiModelProperty(value = "content")
    private String content;
    @ApiModelProperty(value = "thumbsup")
    private int thumbsup;
    @ApiModelProperty(value = "dislike")
    private int dislike;

}

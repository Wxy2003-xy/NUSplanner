package cn.tedu.nusplannerapi.pojo.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ArticleSaveParam {
    @ApiModelProperty(value = "title")
    private String title;
    @ApiModelProperty(value = "content")
    private String content;
}

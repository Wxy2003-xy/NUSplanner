package cn.tedu.nusplannerapi.controller;

import cn.tedu.nusplannerapi.base.response.JsonResult;
import cn.tedu.nusplannerapi.pojo.dto.ArticleSaveParam;
import cn.tedu.nusplannerapi.pojo.vo.ArticleVO;
import cn.tedu.nusplannerapi.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/article")
public class ArticleController {
    @Autowired
    ArticleService articleService;

    @GetMapping("select")
    public JsonResult selectArticle(){
        List<ArticleVO> list =  articleService.selectArticle();
        return JsonResult.ok(list);
    }

    @PostMapping("save")
    public JsonResult saveArticle(@RequestBody ArticleSaveParam articleSaveParam){
        log.debug("saveArticle,articleSaveParam={}",articleSaveParam);
        articleService.save(articleSaveParam);
        return JsonResult.ok();
    }

    @PostMapping("updateLike/{articleId}")
    public JsonResult updateArticleLike(@PathVariable Long articleId){
        articleService.updateLike(articleId);
        return JsonResult.ok();
    }

    @PostMapping("updateDislike/{articleId}")
    public JsonResult updateArticleDislike(@PathVariable Long articleId){
        articleService.updateDislike(articleId);
        return JsonResult.ok();
    }
}

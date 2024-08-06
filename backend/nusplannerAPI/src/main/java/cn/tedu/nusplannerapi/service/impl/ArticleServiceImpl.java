package cn.tedu.nusplannerapi.service.impl;

import cn.tedu.nusplannerapi.mapper.ArticleMapper;
import cn.tedu.nusplannerapi.pojo.dto.ArticleSaveParam;
import cn.tedu.nusplannerapi.pojo.entity.Article;
import cn.tedu.nusplannerapi.pojo.vo.ArticleVO;
import cn.tedu.nusplannerapi.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class ArticleServiceImpl implements ArticleService {
    @Autowired
    ArticleMapper articleMapper;

    @Override
    public List<ArticleVO> selectArticle() {
        List<ArticleVO> list = articleMapper.selectArticle();
        return list;
    }

    @Override
    public void save(ArticleSaveParam articleSaveParam) {
        Article article = new Article();
        //将前端传过来的数据赋值给article对象
        BeanUtils.copyProperties(articleSaveParam,article);
        article.setCreateTime(new Date());
        articleMapper.insert(article);
    }

    @Override
    public void updateLike(Long id) {
        articleMapper.updateLike(id);
    }

    @Override
    public void updateDislike(Long id) {
        articleMapper.updatedislike(id);
    }
}

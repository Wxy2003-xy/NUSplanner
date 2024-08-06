package cn.tedu.nusplannerapi.service;

import cn.tedu.nusplannerapi.pojo.dto.ArticleSaveParam;
import cn.tedu.nusplannerapi.pojo.vo.ArticleVO;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ArticleService {
    List<ArticleVO> selectArticle();

    void save(ArticleSaveParam articleSaveParam);

    void updateLike(Long id);

    void updateDislike(Long id);
}

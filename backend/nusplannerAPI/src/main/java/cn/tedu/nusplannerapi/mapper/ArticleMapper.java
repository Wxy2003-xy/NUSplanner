package cn.tedu.nusplannerapi.mapper;

import cn.tedu.nusplannerapi.pojo.entity.Article;
import cn.tedu.nusplannerapi.pojo.vo.ArticleVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@Mapper
public interface ArticleMapper {
    List<ArticleVO> selectArticle();

    void insert(Article article);

    void updateLike(Long id);

    void updatedislike(Long id);
}

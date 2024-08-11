package cn.tedu.nusplannerapi.base.file;

import cn.tedu.nusplannerapi.base.response.JsonResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/v1/file")
public class UploadController {
    @PostMapping("upload")
    //MultipartFile用来接收上传图片文件的对象,形参名file必须与前端upload组件的name值一致!
    public JsonResult upload(MultipartFile file) throws IOException {
        //1.得到原始文件名
        String fileName = file.getOriginalFilename();
        //2.获取原始文件名中的后缀名
        String suffix = fileName.substring(fileName.lastIndexOf("."));
        //3.生成一个唯一不重复的随机字符串当做文件名
        fileName = UUID.randomUUID()+suffix;
        //4.指定一个磁盘文件夹用来存上传的图片文件,注意:这个路径得自己电脑上有!
        String dirPath = "/Users/zhangyuhao/Documents/Zoom";
        //5.为了提高检索性能,我们可以设置一个自定义日期路径文件夹分层存储图片文件
        //一般以"年/月/日"的格式存,比如: 2021/07/01
        SimpleDateFormat sdf = new SimpleDateFormat("/yyyy/MM/dd/");
        //6.按照当前的实际日期,使用上述格式生成日期路径
        String datePath = sdf.format(new Date());
        //7.创建一个封装了上述路径的file对象
        File dirFile = new File(dirPath+datePath);
        //8.判断文件夹是否存在,如果不存在,则创建
        if(!dirFile.exists()){
            dirFile.mkdirs();//创建多层文件夹
        }
        //9.定义一个完整的图片路径 文件夹路径+日期路径+完整文件名
        String filePath = dirPath+datePath+fileName;
        //10.把上传的图片文件保存在指定的路径下
        file.transferTo(new File(filePath));
        //11.把日期路径+图片名 响应给前端,前端拿到这个数据后回显图片
        return JsonResult.ok(datePath+fileName);
    }

    /**
     * 添加删除图片的方法
     */
    @PostMapping("remove")
    public JsonResult remove(String imgUrl){
        System.out.println(imgUrl);// /2024/06/17/665383c9-ec63-4141-bed8-3f669b74d38e.png
        //拼接完整路径,创建对应的java对象删除磁盘上对应的图片文件
        new File("/Users/zhangyuhao/Documents/Zoom"+imgUrl).delete();
        return JsonResult.ok();
    }
}

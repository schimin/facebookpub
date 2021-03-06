$(document).on("change", 'input[name="tipo"]', function(){

  var TipoPublicacao = $(this).val();

  $(".texto").css('display', 'none');
  $(".link").css('display', 'none');
  $(".imagem").css('display', 'none');
  $(".video").css('display', 'none');

  $("."+TipoPublicacao).css('display', 'block');
});

$(document).on('change', 'select[name="grupos_programacao_select"]', function(){

   var idGrupo = $(this).val();

   $.ajax({
      url: baseURL+'requests/info_group_posting',
      data: {id: idGrupo},
      type: 'POST',
      dataType: 'JSON',
      Async: true,

      success: function(response){

         if(response.status == 1){

            $(".escolha-dono-grupo").css('display', 'block');
            $("#dono_grupo_select").empty();

            for(index in response.admins){

               $("#dono_grupo_select").append('<option value="'+response.admins[index].id_perfil+'">'+response.admins[index].nome+' ('+response.admins[index].id_perfil+')</option>');
            }
         }else{

            swal(erro, nenhum_admin_valido, 'error');
         }
      },

      error: function(error){
         console.log('--- error ----');
         console.log(error.responseText);
      }
   });
});

$(document).on("change", 'input[name="lugar"]', function(){

  var Lugar = $(this).val();

  $(".local-pagina").css('display', 'none');
  $(".local-perfil").css('display', 'none');
  $(".local-grupo").css('display', 'none');

  $(".local-"+Lugar).css('display', 'block');
});

$(document).on("change", 'input[name="repetir_post"]', function(){

  var Repetir = $(this).val();

  if(Repetir == 1){
    $(".repeticao_postagem").css('display', 'block');
  }else{
    $(".repeticao_postagem").css('display', 'none');
  }
});

$(document).ready(function() { 
   var options = {
       success:       afterSuccess,
       beforeSubmit:  beforeSubmit,
       uploadProgress: OnProgress,
       resetForm: true
   }; 
           
    $('#MyUploadForm').submit(function() { 
       $(this).ajaxSubmit(options);            
       return false; 
   }); 
});

function beforeSubmit(){
   if (window.File && window.FileReader && window.FileList && window.Blob){
      
      $("#progressbar").css('width', '0%');
      $("#output").html("");

      var ftype = $('#FileInput')[0].files[0].type; 

      switch(ftype){
         case 'image/png': 
         case 'image/gif': 
         case 'image/jpeg': 
         case 'image/pjpeg':
         break;
         default:
          $("#output").html(extensao_nao_permitida);
         return false
      }
   }
}

function OnProgress(event, position, total, percentComplete){

    $('#progressbox').show();
    $('#progressbar').width(percentComplete + '%')
}

function afterSuccess(response){

   let callback = JSON.parse(response);

   if(callback.status == 1){

      let url = callback.url;

      $("#imagem_imagem").val(url);

      $(".modal").modal('hide');
   }else{
      swal(erro,  erro_upload+callback.error, 'error');
   }
}




/* Validação do formulário */
$(function() {
   ! function() {
      function e() {
         return !!$("#bootstrap-wizard-form").valid() || (o.focusInvalid(), !1)
      }
      var o = $("#bootstrap-wizard-form").validate({
         rules: {

            tipo: "required",
            mensagem_texto: {
               required: 1,
               minlength: 10
            },

            url_link_link:{
               required: 1,
               url: 1
            },

            imagem_imagem:{
               required: 1
            },

            url_video_video:{
               required: 1,
               url: 1
            },

            data_agendamento:{
               required: 1,
               dateITA: true
            },

            hora_agendamento: {
               required: 1,
               time: true
            },

            repetir_post: "required",
            intervalo: "required",

            data_final:{
               required: 1,
               dateITA: true
            },

            paginas_programacao_select: "required",
            grupos_programacao_select: "required",
            perfils_programacao_select: "required",
            dono_grupo_select: "required"
         },
         errorElement: "div",
         errorPlacement: function(e, o) {
            e.addClass("form-control-feedback"), o.closest(".form-group").addClass("has-danger"), "checkbox" === o.prop("type") ? e.insertAfter(o.parent(".checkbox")) : e.insertAfter(o)
         },
         highlight: function(e, o, r) {
            $(e).closest(".form-group").addClass("has-danger").removeClass("has-success"), $(e).removeClass("form-control-success").addClass("form-control-danger")
         },
         unhighlight: function(e, o, r) {
            $(e).closest(".form-group").addClass("has-success").removeClass("has-danger"), $(e).removeClass("form-control-danger").addClass("form-control-success")
         }
      });
      $("#bootstrap-wizard-1").bootstrapWizard({
         tabClass: "nav-tabs",
         nextSelector: ".pager>.btn.next",
         previousSelector: ".pager>.btn.previous",
         onTabShow: function(e, o, r) {
            $(e).addClass("visited");
            var n = $("#finish-btn"),
               s = $("#next-btn"),
               t = o.find("li").length;
            r + 1 == t ? (n.show(), s.hide()) : (n.hide(), s.show())
         },
         onTabClick: function() {
            return e()
         },
         onPrevious: function(e, o, r) {
            $(e).removeClass("visited")
         },
         onNext: function(o, r, n) {
            return e()
         }
      }), 

      $("#finish-btn").on("click", function(o) {

         if(e()){

            var TipoPostagem = $("input[name='tipo']:checked").val();
            var LugarPostagem = $("input[name='lugar']:checked").val();
            var DataAgendamento = $("input[name='data_agendamento']").val();
            var HoraAgendamento = $("input[name='hora_agendamento']").val();
            var RepetirPostagem = $("input[name='repetir_post']:checked").val();
            var Intervalo       = $("select[name='intervalo'] option:selected").val();
            var DataFinal       = $("input[name='data_final']").val();
            var AdminGrupo      = $("select[name='dono_grupo_select'] option:selected").val();
            var Paginas         = '';
            var Grupos          = '';
            var Perfils         = '';

            $("select[name='paginas_programacao_select'] option:selected").each(function(){

               Paginas += $(this).val()+',';

            });

            $("select[name='grupos_programacao_select'] option:selected").each(function(){

               Grupos += $(this).val()+',';

            });

            $("select[name='perfils_programacao_select'] option:selected").each(function(){

               Perfils += $(this).val()+',';

            });

            if(TipoPostagem == 'texto'){

               var mensagem = $("textarea[name='mensagem_texto']").val();

               $.ajax({
                  url: baseURL+'requests/post_texto',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                        mensagem: mensagem,
                        data_agendamento: DataAgendamento,
                        hora_agendamento: HoraAgendamento,
                        repetir_postagem: RepetirPostagem,
                        intervalo: Intervalo,
                        data_final: DataFinal,
                        paginas: Paginas,
                        grupos: Grupos,
                        postar_por: AdminGrupo,
                        perfils: Perfils,
                        lugar: LugarPostagem
                     },

                  success: function(callback){

                     if(callback.status == 1){

                        swal({
                           title: feito,
                           text: programacao_feita,
                           type: 'success'
                        }, function(){

                           window.location.href = baseURL+'conta/programacoes';

                        });

                     }else{

                        swal(erro, erro_programacao+": "+callback.erro, "error");

                        return false;
                     }

                  },

                  error: function(error){
                     console.log(error.responseText);
                  }

               });

            }else if(TipoPostagem == 'link'){

               var mensagem = $("textarea[name='mensagem_link']").val();
               var titulolink = $("input[name='titulo_link_link']").val();
               var descricaolink = $("textarea[name='descricao_link_link']").val();
               var imagemlink = $("input[name='imagem_link_link']").val();
               var urllink = $("input[name='url_link_link']").val();

               $.ajax({
                  url: baseURL+'requests/post_link',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                        mensagem: mensagem,
                        titulo_link: titulolink,
                        descricao_link: descricaolink,
                        imagem_link: imagemlink,
                        url_link: urllink,
                        data_agendamento: DataAgendamento,
                        hora_agendamento: HoraAgendamento,
                        repetir_postagem: RepetirPostagem,
                        intervalo: Intervalo,
                        data_final: DataFinal,
                        paginas: Paginas,
                        grupos: Grupos,
                        postar_por: AdminGrupo,
                        perfils: Perfils,
                        lugar: LugarPostagem
                     },

                  success: function(callback){

                     if(callback.status == 1){

                        swal({
                           title: feito,
                           text: programacao_feita,
                           type: 'success'
                        }, function(){

                           window.location.href = baseURL+'conta/programacoes';

                        });

                     }else{

                        swal(erro, erro_programacao+": "+callback.erro, "error");

                        return false;
                     }

                  },

                  error: function(error){
                     console.log(error.responseText);
                  }

               });

            }else if(TipoPostagem == 'imagem'){

               var mensagem = $("textarea[name='mensagem_post_imagem']").val();
               var imagemimagem = $("input[name='imagem_imagem']").val();

               $.ajax({
                  url: baseURL+'requests/post_imagem',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                        mensagem: mensagem,
                        imagem_imagem: imagemimagem,
                        data_agendamento: DataAgendamento,
                        hora_agendamento: HoraAgendamento,
                        repetir_postagem: RepetirPostagem,
                        intervalo: Intervalo,
                        data_final: DataFinal,
                        paginas: Paginas,
                        grupos: Grupos,
                        postar_por: AdminGrupo,
                        perfils: Perfils,
                        lugar: LugarPostagem
                     },

                  success: function(callback){

                     if(callback.status == 1){

                        swal({
                           title: feito,
                           text: programacao_feita,
                           type: 'success'
                        }, function(){

                           window.location.href = baseURL+'conta/programacoes';

                        });

                     }else{

                        swal(erro, erro_programacao+": "+callback.erro, "error");

                        return false;
                     }

                  },

                  error: function(error){
                     console.log(error.responseText);
                  }

               });

            }else if(TipoPostagem == 'video'){


               var titulovideo = $("input[name='titulo_video_video']").val();
               var descricaovideo = $("textarea[name='descricao_video_video']").val();
               var urlvideo = $("input[name='url_video_video']").val();
               var mensagem = $("textarea[name='mensagem_post_video']").val();

               $.ajax({
                  url: baseURL+'requests/post_video',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                        mensagem: mensagem,
                        titulo_video: titulovideo,
                        descricao_video: descricaovideo,
                        url_video: urlvideo,
                        data_agendamento: DataAgendamento,
                        hora_agendamento: HoraAgendamento,
                        repetir_postagem: RepetirPostagem,
                        intervalo: Intervalo,
                        data_final: DataFinal,
                        paginas: Paginas,
                        grupos: Grupos,
                        postar_por: AdminGrupo,
                        perfils: Perfils,
                        lugar: LugarPostagem
                     },

                  success: function(callback){

                     if(callback.status == 1){

                        swal({
                           title: feito,
                           text: programacao_feita,
                           type: 'success'
                        }, function(){

                           window.location.href = baseURL+'conta/programacoes';

                        });

                     }else{

                        swal(erro, erro_programacao+": "+callback.erro, "error");

                        return false;
                     }

                  },

                  error: function(error){
                     console.log(error.responseText);
                  }

               });

            }else{

               swal(erro, post_nao_identificado, "error");

               return false;
            }

         }else{

            swal(erro, preencha_campos, "error")
         }

      
      })

   }()
});
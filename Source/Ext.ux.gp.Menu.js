Ext.define('Ext.ux.gp.Menu', {
    extend: 'Ext.Panel',
    xtype:'gpmenu',
    config: {
        modal: true,
        hideOnMaskTap: true,
        centered: true,
        height: '50%',
        width: '70%',
        layout:'fit',
        maxHeight:null,
        items:[
               {
                   xtype:'toolbar',
                   title:'Opzioni',
                   docked: 'top',
                   hidden:true,
                   items:[
                          {
                              text:'Close',
                              closeBtn:true,
                              ui:'round',
                              listeners:{
                                  tap:function(button){
                                      button.parent.parent.destroy();
                                  }
                              }
                          }
                   ]
               }
        ]
    },
    initialize:function(){
        this.callParent(arguments);
        Ext.Viewport.add(this);
        Ext.Viewport.on('orientationchange',this.resize(),this);
        menuList=Ext.create('Ext.List',{
                itemTpl : '{descr}',
                store   : Ext.create('Ext.data.Store', {
                    fields : [
                        'id',
                        'descr'
                    ]
                })
        });
        menuList.on('itemtap',function(sender, index, target, record, e, eOpts){this.fireEvent('itemtap',sender, index, target, record, e, eOpts );this.destroy()},this);
        menuList.getStore().on('load','_storeChanged',this);
        menuList.getStore().on('addrecords','_storeChanged',this);
        menuList.getStore().on('clear','_storeChanged',this);
        menuList.on('painted','resize',this);
        this.on('erased',function(){this.destroy();},this)
        this.add(menuList);
    },
    _storeChanged:function(){
        this.down('*[xtype=list]').hide();
        this.down('*[xtype=list]').show();
    },
    resize:function(){
        if(this.down('*[xtype=list]')==null){
            return;
        }
        
        if(this.down('*[xtype=list]').element.down('.x-list-item')==null){
            return;
        }
        itemHeight=this.down('*[xtype=list]').element.down('.x-list-item').getHeight();
        var maxHeight='100%';
        if(this.config.maxHeight!=null){
            maxHeight=this.config.maxHeight;
        }
        
        if(maxHeight.indexOf('px')>-1){
            maxHeight=this.config.maxHeight.replace('px','');
            maxHeight=parseInt(100*maxHeight/Ext.getBody().getHeight())+'%';
        }
        else{
            if(maxHeight.indexOf('%')<0){
                maxHeight=this.config.maxHeight+'%';
            }
        }
        maxHeight=parseInt(Ext.getBody().getHeight()*parseInt(maxHeight.replace('%',''))/100);
        this.setHeight(this.config.maxHeight);
        var titleBar=0;
        if(!this.down('*[xtype=toolbar]').isHidden()){
            titleBar=1;
        }
        if(itemHeight*(store.getCount()+titleBar)<maxHeight){
            maxHeight=Ext.getBody().getHeight();
            height=itemHeight*(store.getCount()+titleBar)*100/maxHeight+3;
            height=parseInt(Ext.getBody().getHeight()*height/100)+'px';
            this.setHeight(height);
        }
        this.fireEvent('resize',this);
    },
    setTitle:function(value,showCloseButton,closeButtonText){
        if(showCloseButton==null||showCloseButton==undefined){
            showCloseButton=true;
        }
        if(closeButtonText!=undefined&&closeButtonText!=null){
            this.down('*[closeBtn=true]').setText(closeButtonText);
        }
        if(value==undefined||value==null){
            this.down('*[xtype=toolbar]').setHidden(true);
        }
        else{
            this.down('*[xtype=toolbar]').setTitle(value);
            this.down('*[xtype=toolbar]').setHidden(false);
            this.down('*[closeBtn=true]').setHidden(!showCloseButton);
        }
        this.resize();
    },
    getTitle:function(value){
        return this.down('*[xtype=toolbar]').getTitle();
    },
    setMaxHeight:function(value){
        this.config.maxHeight=value;
        this.resize();
    },
    getMaxHeight:function(){
        return this.config.maxHeight;
    }
});